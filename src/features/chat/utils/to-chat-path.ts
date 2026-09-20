import { CHATS_PATH } from "@/features/chat/constants/chats-path";

interface Props {
  id: string;
}

export const toChatPath = ({ id }: Props) => `${CHATS_PATH}/${id}`;
