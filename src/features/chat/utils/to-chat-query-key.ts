import { CHAT_QUERY_KEY } from "@/features/chat/constants/chat-query-key";

interface Props {
  chatId: string;
}

export const toChatQueryKey = ({ chatId }: Props) => [...CHAT_QUERY_KEY, chatId];
