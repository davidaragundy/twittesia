import { cn } from "@/shared/utils/cn";

import { MESSAGE_TIME_FORMAT } from "@/features/chat/constants/message-time-format";
import type { ChatMessage } from "@/features/chat/types/chat-message";

interface Props {
  message: ChatMessage;
}

export const ChatMessageItem = ({ message }: Props) => (
  <div className={cn("flex flex-col gap-1", message.isMine ? "items-end" : "items-start")}>
    <div
      className={cn(
        "max-w-[80%] rounded-3xl px-4 py-2.5 text-sm break-words whitespace-pre-wrap",
        message.isMine ? "bg-primary text-primary-foreground" : "bg-muted",
      )}
    >
      {message.body}
    </div>
    <time
      dateTime={message.sentAt.toISOString()}
      className="px-2 text-xs text-muted-foreground"
      suppressHydrationWarning
    >
      {MESSAGE_TIME_FORMAT.format(message.sentAt)}
    </time>
  </div>
);
