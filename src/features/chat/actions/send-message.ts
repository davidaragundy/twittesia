"use server";

import type { ActionResponse } from "@/shared/types/action-response";
import type { BaseActionErrorCode } from "@/shared/types/base-action-error-code";
import { generateId } from "@/shared/utils/generate-id";
import { isRateLimited } from "@/shared/utils/is-rate-limited";

import { getSession } from "@/features/auth/queries/get-session";
import { sendMessageRateLimits } from "@/features/chat/lib/send-message-rate-limits";
import { getChat } from "@/features/chat/queries/get-chat";
import { sendMessageSchema } from "@/features/chat/schemas/send-message-schema";
import { isChatParticipant } from "@/features/chat/utils/is-chat-participant";
import { publishChatEvent } from "@/features/chat/utils/publish-chat-event";

interface Props {
  chatId: string;
  body: string;
}

/**
 * Says something to the one other person in a chat.
 *
 * The message is put on the chat's channel and nowhere else: it reaches whoever is listening at
 * that moment, and if nobody is, it is gone. Nothing here writes it down, and nothing reads it
 * back later.
 *
 * It comes back to the sender the same way it goes to the other side, so what a page shows is
 * what actually left it rather than what it hoped to send.
 */
export const sendMessage = async ({
  chatId,
  body,
}: Props): Promise<ActionResponse<null, "CHAT_NOT_FOUND" | BaseActionErrorCode>> => {
  const input = sendMessageSchema.safeParse({ chatId, body });

  if (!input.success) {
    return {
      data: null,
      error: { code: "INVALID_INPUT", message: input.error.issues[0]?.message ?? "Invalid input" },
    };
  }

  const session = await getSession();

  if (!session) {
    return {
      data: null,
      error: { code: "UNAUTHORIZED", message: "You need an identity to do that" },
    };
  }

  if (await isRateLimited({ limits: sendMessageRateLimits, identityId: session.user.id })) {
    return {
      data: null,
      error: { code: "RATE_LIMITED", message: "You're sending too fast. Give it a moment." },
    };
  }

  const chat = await getChat({ id: input.data.chatId });

  if (!chat || !isChatParticipant({ chat, identityId: session.user.id })) {
    return { data: null, error: { code: "CHAT_NOT_FOUND", message: "That chat has gone" } };
  }

  const sent = await publishChatEvent({
    chatId: chat.id,
    event: {
      type: "message",
      id: generateId(),
      authorId: session.user.id,
      body: input.data.body,
      sentAt: Date.now(),
    },
  });

  if (!sent) {
    return { data: null, error: { code: "UNKNOWN", message: "Couldn't send that" } };
  }

  return { data: null, error: null };
};
