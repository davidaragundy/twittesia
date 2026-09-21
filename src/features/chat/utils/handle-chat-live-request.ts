import "server-only";

import { NextResponse } from "next/server";

import { redis } from "@/shared/lib/redis/server";

import { getSession } from "@/features/auth/queries/get-session";
import { CHAT_HEARTBEAT_MS } from "@/features/chat/constants/chat-heartbeat-ms";
import { CHAT_PRESENCE_INTERVAL_MS } from "@/features/chat/constants/chat-presence-interval-ms";
import { getChat } from "@/features/chat/queries/get-chat";
import { chatEventSchema } from "@/features/chat/schemas/chat-event-schema";
import { chatIdSchema } from "@/features/chat/schemas/chat-id-schema";
import { isChatParticipant } from "@/features/chat/utils/is-chat-participant";
import { toChatChannel } from "@/features/chat/utils/to-chat-channel";

/**
 * The connection a room holds open, and the only way anything said in a chat travels.
 *
 * It subscribes to the chat's channel for one of the two people in it, and forwards what comes
 * back as it comes. Nothing is read from a store and nothing is written to one: a message that
 * arrives while nobody is listening is gone.
 *
 * Presence comes out of the connection rather than out of a key. Opening one says so on the
 * channel and asks whoever is already there to say so back; closing one says so too. Someone with
 * the room open twice is here until the last of them closes, near enough.
 *
 * It also answers for the page behind it: a message it forwards is acknowledged on the channel,
 * so the sender is told their message reached the other page rather than only that it left
 * theirs. The acknowledgement carries the message's id and nothing else.
 */
export const handleChatLiveRequest = async (
  request: Request,
  { params }: RouteContext<"/api/chats/[chatId]/live">,
) => {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ message: "You need an identity to do that" }, { status: 401 });
  }

  const { chatId } = await params;
  const id = chatIdSchema.safeParse(chatId);

  if (!id.success) return NextResponse.json({ message: "That chat has gone" }, { status: 404 });

  const chat = await getChat({ id: id.data });

  // Someone who is not in the chat is told what anyone else who isn't is told
  if (!chat || !isChatParticipant({ chat, identityId: session.user.id })) {
    return NextResponse.json({ message: "That chat has gone" }, { status: 404 });
  }

  const viewerId = session.user.id;
  const channel = toChatChannel({ id: chat.id });
  const encoder = new TextEncoder();
  const subscriber = redis.subscribe<string>([channel]);

  // Set once the stream starts, for the browser going away, which can arrive as either signal
  let closeStream = () => {};

  const stream = new ReadableStream({
    // The browser closed the page or the connection: said here, where the stream learns it first
    cancel() {
      closeStream();
    },
    start(controller) {
      let isOpen = true;

      const write = (line: string) => {
        if (!isOpen) return;

        try {
          controller.enqueue(encoder.encode(line));
        } catch {
          isOpen = false;
        }
      };

      const publish = (event: unknown) =>
        redis.publish(channel, JSON.stringify(event)).catch(() => null);

      const close = () => {
        if (!isOpen) return;

        isOpen = false;
        clearInterval(heartbeat);
        clearInterval(presence);
        clearTimeout(untilExpiry);
        publish({ type: "away", identityId: viewerId });
        subscriber.removeAllListeners();
        subscriber.unsubscribe().catch(() => null);

        try {
          controller.close();
        } catch {
          // The connection went first, which is the usual way this ends
        }
      };

      subscriber.on("message", ({ message }) => {
        const event = chatEventSchema.safeParse(JSON.parse(String(message) || "null"));

        if (!event.success) return;

        write(`data: ${JSON.stringify(event.data)}\n\n`);

        // Someone just arrived and is asking who else is here
        if (event.data.type === "here" && event.data.reply && event.data.identityId !== viewerId) {
          publish({ type: "here", identityId: viewerId, reply: false });
        }

        // The other side's message got here, which is the most anyone can honestly be told
        if (event.data.type === "message" && event.data.authorId !== viewerId) {
          publish({ type: "received", identityId: viewerId, messageId: event.data.id });
        }

        // The chat is gone, so there is nothing left to hold this open
        if (event.data.type === "ended") close();
      });

      subscriber.on("error", close);

      const heartbeat = setInterval(() => write(": ping\n\n"), CHAT_HEARTBEAT_MS);

      // Still here, said again now and then: the other side stops counting this room as here
      // when these stop, whether or not anything noticed it close
      const presence = setInterval(
        () => publish({ type: "here", identityId: viewerId, reply: false }),
        CHAT_PRESENCE_INTERVAL_MS,
      );

      // A chat ends at its expiry, so the connection does too rather than hanging on to a chat
      // that is no longer there
      const untilExpiry = setTimeout(close, Math.max(chat.expiresAt.getTime() - Date.now(), 0));

      request.signal.addEventListener("abort", close);
      closeStream = close;

      write(": open\n\n");
      publish({ type: "here", identityId: viewerId, reply: true });
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/event-stream",
      "cache-control": "no-store, no-transform",
      connection: "keep-alive",
    },
  });
};
