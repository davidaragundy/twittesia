import type { ChatMessage } from "@/features/chat/types/chat-message";

interface Props {
  run: ChatMessage[];
  lastMineId?: string;
  isOtherHere: boolean;
}

export const useChatMessageRun = ({ run, lastMineId, isOtherHere }: Props) => {
  const last = run[run.length - 1];

  // Said only under the reader's last message. Nobody there means it was lost, which is the deal.
  const delivery =
    last.id !== lastMineId
      ? null
      : last.isDelivered
        ? "Delivered"
        : isOtherHere
          ? "Sent"
          : "Nobody there";

  return { last, delivery };
};
