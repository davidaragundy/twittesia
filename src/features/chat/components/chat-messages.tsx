"use client";

import { BubbleChatLockIcon, ShieldKeyIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/shared/components/ui/empty";
import { Marker, MarkerContent, MarkerIcon } from "@/shared/components/ui/marker";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/shared/components/ui/message-scroller";

import { ChatMessageRun } from "@/features/chat/components/chat-message-run";
import { ChatTyping } from "@/features/chat/components/chat-typing";
import { useChatMessages } from "@/features/chat/hooks/use-chat-messages";
import type { ChatMessage } from "@/features/chat/types/chat-message";

interface Props {
  messages: ChatMessage[];
  // The other side, for the sign that says they are writing
  otherName: string;
  isOtherTyping: boolean;
  isOtherHere: boolean;
}

// What has been said while this page has been open, which is all there is: nothing was kept from
// before it opened, and nothing is kept after it closes. It follows the conversation while the
// reader is at the end of it, and stays put while they scroll back to reread.
export const ChatMessages = ({ messages, otherName, isOtherTyping, isOtherHere }: Props) => {
  const { runs, lastMineId } = useChatMessages({ messages });

  return (
    <MessageScrollerProvider autoScroll>
      <MessageScroller className="flex-1">
        <MessageScrollerViewport aria-label="Conversation">
          <MessageScrollerContent>
            {runs.length ? (
              <MessageScrollerItem>
                <Marker variant="separator">
                  <MarkerIcon>
                    <HugeiconsIcon icon={ShieldKeyIcon} />
                  </MarkerIcon>
                  <MarkerContent>Only the two of you can read this</MarkerContent>
                </Marker>
              </MessageScrollerItem>
            ) : (
              <MessageScrollerItem className="my-auto">
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <HugeiconsIcon icon={BubbleChatLockIcon} />
                    </EmptyMedia>
                    <EmptyTitle>Nothing here, and nothing kept</EmptyTitle>
                    <EmptyDescription>
                      What you say reaches the other page and is written down nowhere — not here,
                      and not for you either. Close this page and the conversation is gone.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              </MessageScrollerItem>
            )}

            {runs.map((run) => (
              // A run keeps the id of its first message, so it stays one item as it grows
              <MessageScrollerItem key={run[0].id} messageId={run[0].id}>
                <ChatMessageRun run={run} lastMineId={lastMineId} isOtherHere={isOtherHere} />
              </MessageScrollerItem>
            ))}

            {isOtherTyping && (
              <MessageScrollerItem>
                <ChatTyping name={otherName} />
              </MessageScrollerItem>
            )}
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton />
      </MessageScroller>
    </MessageScrollerProvider>
  );
};
