import { cn } from "cn";

import { MESSAGE_TIME_FORMAT } from "@/features/chat/constants/message-time-format";
import type { ChatMessage } from "@/features/chat/types/chat-message";

interface Props {
  message: ChatMessage;
  // Whether this is the last thing the reader said, which is where the delivery sign goes
  isLastOfMine: boolean;
  // Whether the other side has the chat open, which is the difference between a message that has
  // not been acknowledged yet and one nobody was there to receive
  isOtherHere: boolean;
}

export const ChatMessageItem = ({ message, isLastOfMine, isOtherHere }: Props) => (
  <div className={cn("flex flex-col gap-1", message.isMine ? "items-end" : "items-start")}>
    <div
      className={cn(
        "max-w-[80%] rounded-3xl px-4 py-2.5 text-sm break-words whitespace-pre-wrap",
        message.isMine ? "bg-primary text-primary-foreground" : "bg-muted",
      )}
    >
      {message.body}
    </div>
    <p className="flex items-center gap-1.5 px-2 text-xs text-muted-foreground">
      <time dateTime={message.sentAt.toISOString()} suppressHydrationWarning>
        {MESSAGE_TIME_FORMAT.format(message.sentAt)}
      </time>

      {isLastOfMine && (
        <span>· {message.isDelivered ? "Delivered" : isOtherHere ? "Sent" : "Nobody there"}</span>
      )}
    </p>
  </div>
);
