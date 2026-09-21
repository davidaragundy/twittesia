import { useEffect, useRef, useState } from "react";

import { CHAT_PRESENCE_FORGET_MS } from "@/features/chat/constants/chat-presence-forget-ms";
import { TYPING_FORGET_MS } from "@/features/chat/constants/typing-forget-ms";
import { useChatCrypto } from "@/features/chat/hooks/use-chat-crypto";
import { chatEventSchema } from "@/features/chat/schemas/chat-event-schema";
import type { ChatMessage } from "@/features/chat/types/chat-message";
import { decryptMessage } from "@/features/chat/utils/decrypt-message";
import { toChatLivePath } from "@/features/chat/utils/to-chat-live-path";

interface Props {
  chatId: string;
  viewerId: string;
  // The other person, whose coming and going this follows
  otherId: string;
}

/**
 * The conversation, for as long as this page is open.
 *
 * Messages arrive as boxes and are opened here, with a key this page agreed with the other side
 * and nothing else has. They live in this component's state and nowhere else: not in a store, not
 * in this browser. Closing the page ends the conversation as far as anything is concerned, and
 * reopening it starts an empty one.
 *
 * The connection reopens by itself — the browser does that for a stream that ends — and the page
 * says whether it is up, because a message sent while it is down never happened. The keys are
 * agreed again each time, so what was said before a reconnection cannot be opened after it, and
 * there is nothing kept that would let anyone try.
 */
export const useChatLive = ({ chatId, viewerId, otherId }: Props) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isOtherHere, setOtherHere] = useState(false);
  const [isOtherTyping, setOtherTyping] = useState(false);
  const [isConnected, setConnected] = useState(false);
  const [isEnded, setEnded] = useState(false);
  const { key, safetyNumber, hasSecret, isReady, announce, onKeyEvent } = useChatCrypto({
    chatId,
    otherId,
  });
  const viewer = useRef(viewerId);
  const opener = useRef(key);
  // Messages are opened one at a time, so they land in the order they arrived
  const queue = useRef<Promise<void>>(Promise.resolve());
  const typing = useRef<ReturnType<typeof setTimeout>>(undefined);
  const presence = useRef<ReturnType<typeof setTimeout>>(undefined);

  viewer.current = viewerId;
  opener.current = key;

  useEffect(() => {
    const source = new EventSource(toChatLivePath({ chatId }));

    source.onopen = () => setConnected(true);

    source.onerror = () => {
      setConnected(false);
      setOtherHere(false);
    };

    // Anything from the other side says they are still here; silence long enough says they left,
    // even when their leaving never reached us
    const seen = () => {
      setOtherHere(true);
      clearTimeout(presence.current);
      presence.current = setTimeout(() => {
        setOtherHere(false);
        setOtherTyping(false);
      }, CHAT_PRESENCE_FORGET_MS);
    };

    source.onmessage = (event) => {
      const parsed = chatEventSchema.safeParse(JSON.parse(event.data || "null"));

      if (!parsed.success) return;

      const data = parsed.data;

      if (data.type === "message") {
        if (data.authorId === otherId) seen();

        queue.current = queue.current.then(async () => {
          if (!opener.current) return;

          const body = await decryptMessage({
            key: opener.current,
            cipher: data.cipher,
            iv: data.iv,
          });

          // A message this page cannot open is one it was not meant to: it is left out rather
          // than shown as anything
          if (body === null) return;

          setMessages((current) => [
            ...current,
            {
              id: data.id,
              body,
              sentAt: new Date(data.sentAt),
              isMine: data.authorId === viewer.current,
              isDelivered: false,
            },
          ]);

          // The other side is writing no longer: they said it
          setOtherTyping(false);
        });

        return;
      }

      if (data.type === "key") {
        void onKeyEvent(data);
        return;
      }

      if (data.type === "ended") {
        setEnded(true);
        setOtherTyping(false);
        return;
      }

      if (data.identityId !== otherId) return;

      if (data.type === "away") {
        clearTimeout(presence.current);
        setOtherHere(false);
        setOtherTyping(false);
        return;
      }

      seen();

      if (data.type === "received") {
        setMessages((current) =>
          current.map((message) =>
            message.id === data.messageId ? { ...message, isDelivered: true } : message,
          ),
        );

        return;
      }

      if (data.type === "typing") {
        setOtherTyping(true);
        clearTimeout(typing.current);
        typing.current = setTimeout(() => setOtherTyping(false), TYPING_FORGET_MS);

        return;
      }

      // Whoever is already here says who they are, so an arriving page can agree a key with them
      if (data.type === "here" && data.reply) void announce({ reply: false });
    };

    return () => {
      clearTimeout(typing.current);
      clearTimeout(presence.current);
      source.close();
    };
  }, [announce, chatId, onKeyEvent, otherId]);

  // This page says who it is as soon as it has both a key to offer and somewhere to offer it
  useEffect(() => {
    if (!isConnected || !isReady) return;

    void announce({ reply: true });
  }, [announce, isConnected, isReady]);

  return {
    messages,
    isOtherHere,
    isOtherTyping,
    isConnected,
    isEnded,
    key,
    safetyNumber,
    hasSecret,
  };
};
