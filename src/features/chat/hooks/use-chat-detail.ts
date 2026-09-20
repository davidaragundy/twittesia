import { useChatQuery } from "@/features/chat/hooks/use-chat-query";
import type { ChatView } from "@/features/chat/types/chat-view";

interface Props {
  initialView: ChatView;
  viewerId: string;
}

// A chat changes because of what someone else does — knocking, or letting the reader in — so the
// page follows the chat rather than what it was given once
export const useChatDetail = ({ initialView, viewerId }: Props) => {
  const { data } = useChatQuery({ chatId: initialView.chat.id, initialView });
  const { chat, role, knocks, isWaiting } = data;
  const other = chat.creator.id === viewerId ? chat.guest : chat.creator;

  return {
    chat,
    role,
    knocks,
    isWaiting,
    // The person on the other side, once there is one and the reader is in the chat
    other: role === "visitor" ? null : other,
  };
};
