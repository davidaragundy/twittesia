import type { Chat } from "@/features/chat/types/chat";

interface Props {
  chat: Chat;
  identityId?: string | null;
}

// Whether an identity is one of the two people in a chat. Nobody else reads a word of it.
export const isChatParticipant = ({ chat, identityId }: Props) =>
  !!identityId && (chat.creator.id === identityId || chat.guest?.id === identityId);
