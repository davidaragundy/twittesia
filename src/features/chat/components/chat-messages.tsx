"use client";

import { useEffect, useRef } from "react";

import { ChatMessageItem } from "@/features/chat/components/chat-message-item";
import type { ChatMessage } from "@/features/chat/types/chat-message";

interface Props {
  messages: ChatMessage[];
}

// What has been said while this page has been open, which is all there is: nothing was kept from
// before it opened, and nothing is kept after it closes
export const ChatMessages = ({ messages }: Props) => {
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    end.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  if (!messages.length) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 py-12 text-center">
        <p className="text-sm font-medium">Nothing here, and nothing kept</p>
        <p className="max-w-xs text-sm text-muted-foreground">
          What you say reaches the other page and is written down nowhere — not here, and not for
          you either. Close this page and the conversation is gone.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col justify-end gap-4 py-4">
      {messages.map((message) => (
        <ChatMessageItem key={message.id} message={message} />
      ))}
      <div ref={end} />
    </div>
  );
};
