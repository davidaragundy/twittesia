import { useEffect, useRef, useState } from "react";

import { chatEventSchema } from "@/features/chat/schemas/chat-event-schema";
import type { ChatMessage } from "@/features/chat/types/chat-message";
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
 * Messages live in this component's state and nowhere else: not in a store, not in this browser.
 * Closing the page ends the conversation as far as anything is concerned, and reopening it starts
 * an empty one.
 *
 * The connection reopens by itself — the browser does that for a stream that ends — and the page
 * says whether it is up, because a message sent while it is down never happened.
 */
export const useChatLive = ({ chatId, viewerId, otherId }: Props) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isOtherHere, setOtherHere] = useState(false);
  const [isConnected, setConnected] = useState(false);
  const viewer = useRef(viewerId);

  viewer.current = viewerId;

  useEffect(() => {
    const source = new EventSource(toChatLivePath({ chatId }));

    source.onopen = () => setConnected(true);

    source.onerror = () => {
      setConnected(false);
      setOtherHere(false);
    };

    source.onmessage = (event) => {
      const parsed = chatEventSchema.safeParse(JSON.parse(event.data || "null"));

      if (!parsed.success) return;

      const data = parsed.data;

      if (data.type === "message") {
        setMessages((current) => [
          ...current,
          {
            id: data.id,
            body: data.body,
            sentAt: new Date(data.sentAt),
            isMine: data.authorId === viewer.current,
          },
        ]);

        return;
      }

      if (data.identityId !== otherId) return;

      setOtherHere(data.type === "here");
    };

    return () => source.close();
  }, [chatId, otherId]);

  return { messages, isOtherHere, isConnected };
};
