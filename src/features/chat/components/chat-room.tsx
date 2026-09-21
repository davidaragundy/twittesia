"use client";

import { SeededAvatar } from "@/shared/components/seeded-avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";

import { ChatComposer } from "@/features/chat/components/chat-composer";
import { ChatEnded } from "@/features/chat/components/chat-ended";
import { ChatMessages } from "@/features/chat/components/chat-messages";
import { ChatPresence } from "@/features/chat/components/chat-presence";
import { ChatSafetyNumber } from "@/features/chat/components/chat-safety-number";
import { ChatWithoutKey } from "@/features/chat/components/chat-without-key";
import { EndChatButton } from "@/features/chat/components/end-chat-button";
import { useChatCountdown } from "@/features/chat/hooks/use-chat-countdown";
import { useChatLive } from "@/features/chat/hooks/use-chat-live";
import type { ChatParticipant } from "@/features/chat/types/chat-participant";

interface Props {
  chatId: string;
  viewerId: string;
  // The other person: a chat only ever has one
  other: ChatParticipant;
  expiresAt: Date;
}

// Where the conversation happens, for as long as this page is open
export const ChatRoom = ({ chatId, viewerId, other, expiresAt }: Props) => {
  const {
    messages,
    isOtherHere,
    isOtherTyping,
    isConnected,
    isEnded,
    key,
    safetyNumber,
    hasSecret,
  } = useChatLive({ chatId, viewerId, otherId: other.id });
  const { timeLeft, hasExpired } = useChatCountdown({ expiresAt });

  if (isEnded || hasExpired) return <ChatEnded />;

  return (
    // As tall as the window between the header and, on a phone, the tab bar, so the header and
    // composer stay put while the conversation scrolls between them; it takes back most of the
    // page's bottom padding to fit
    <div className="-mb-20 flex h-[calc(100svh-11rem)] flex-col gap-4 md:h-[calc(100svh-7rem)]">
      <div className="flex items-center gap-3">
        <SeededAvatar seed={other.handle} className="size-10 shrink-0" />
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="truncate leading-none font-medium">{other.name}</p>
          <ChatPresence name={other.name} isHere={isOtherHere} isConnected={isConnected} />
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-1">
          {/* The clock runs in the browser, so the first paint has nothing to disagree with */}
          {timeLeft && (
            <Badge variant="outline" className="hidden sm:inline-flex" suppressHydrationWarning>
              Ends in {timeLeft}
            </Badge>
          )}

          <ChatSafetyNumber safetyNumber={safetyNumber} otherName={other.name} />

          <EndChatButton chatId={chatId} />
        </div>
      </div>

      <Separator />

      {hasSecret ? (
        <>
          <ChatMessages
            messages={messages}
            otherName={other.name}
            isOtherTyping={isOtherTyping}
            isOtherHere={isOtherHere}
          />

          <ChatComposer chatId={chatId} isConnected={isConnected} chatKey={key} />
        </>
      ) : (
        <ChatWithoutKey />
      )}
    </div>
  );
};
