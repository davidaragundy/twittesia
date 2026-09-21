import type { ChatMessage } from "@/features/chat/types/chat-message";
import { groupChatMessages } from "@/features/chat/utils/group-chat-messages";

interface Props {
  messages: ChatMessage[];
}

export const useChatMessages = ({ messages }: Props) => {
  const runs = groupChatMessages(messages);

  // Only the last thing the reader said says whether it arrived; the ones before it are implied
  const lastMineId = messages.findLast((message) => message.isMine)?.id;

  return { runs, lastMineId };
};
