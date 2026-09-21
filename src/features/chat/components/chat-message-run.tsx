import { Bubble, BubbleContent } from "@/shared/components/ui/bubble";
import { Message, MessageContent, MessageFooter } from "@/shared/components/ui/message";

import { MESSAGE_TIME_FORMAT } from "@/features/chat/constants/message-time-format";
import { useChatMessageRun } from "@/features/chat/hooks/use-chat-message-run";
import type { ChatMessage } from "@/features/chat/types/chat-message";

interface Props {
  // Consecutive messages from one side, never empty
  run: ChatMessage[];
  // The last thing the reader said, which is where the delivery sign goes
  lastMineId?: string;
  // Whether the other side has the chat open, which is the difference between a message that has
  // not been acknowledged yet and one nobody was there to receive
  isOtherHere: boolean;
}

// One burst from one side: its bubbles together, and the time once, under the last of them
export const ChatMessageRun = ({ run, lastMineId, isOtherHere }: Props) => {
  const { last, delivery } = useChatMessageRun({ run, lastMineId, isOtherHere });
  const isMine = last.isMine;

  return (
    <Message align={isMine ? "end" : "start"}>
      <MessageContent>
        {run.map((message) => (
          <Bubble key={message.id} variant={isMine ? "default" : "muted"}>
            <BubbleContent className="whitespace-pre-wrap">{message.body}</BubbleContent>
          </Bubble>
        ))}
        <MessageFooter>
          <time dateTime={last.sentAt.toISOString()} suppressHydrationWarning>
            {MESSAGE_TIME_FORMAT.format(last.sentAt)}
          </time>
          {delivery && <>&nbsp;·&nbsp;{delivery}</>}
        </MessageFooter>
      </MessageContent>
    </Message>
  );
};
