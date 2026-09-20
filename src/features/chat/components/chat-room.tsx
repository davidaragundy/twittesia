"use client";

import { SeededAvatar } from "@/shared/components/seeded-avatar";

import { ChatComposer } from "@/features/chat/components/chat-composer";
import { ChatMessages } from "@/features/chat/components/chat-messages";
import { ChatPresence } from "@/features/chat/components/chat-presence";
import { ChatSafetyNumber } from "@/features/chat/components/chat-safety-number";
import { ChatWithoutKey } from "@/features/chat/components/chat-without-key";
import { useChatLive } from "@/features/chat/hooks/use-chat-live";
import type { ChatParticipant } from "@/features/chat/types/chat-participant";

interface Props {
  chatId: string;
  viewerId: string;
  // The other person: a chat only ever has one
  other: ChatParticipant;
}

// Where the conversation happens, for as long as this page is open
export const ChatRoom = ({ chatId, viewerId, other }: Props) => {
  const { messages, isOtherHere, isConnected, key, safetyNumber, hasSecret } = useChatLive({
    chatId,
    viewerId,
    otherId: other.id,
  });

  return (
    <div className="flex min-h-[70svh] flex-col gap-4">
      <div className="flex items-center gap-3 border-b pb-4">
        <SeededAvatar seed={other.handle} className="size-10" />
        <div className="flex flex-col gap-0.5">
          <p className="leading-none font-medium">{other.name}</p>
          <ChatPresence name={other.name} isHere={isOtherHere} isConnected={isConnected} />
        </div>

        <ChatSafetyNumber safetyNumber={safetyNumber} otherName={other.name} />
      </div>

      {hasSecret ? (
        <>
          <ChatMessages messages={messages} />

          <ChatComposer chatId={chatId} isConnected={isConnected} chatKey={key} />
        </>
      ) : (
        <ChatWithoutKey />
      )}
    </div>
  );
};
