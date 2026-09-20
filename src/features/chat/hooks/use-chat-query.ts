import { useQuery } from "@tanstack/react-query";

import { CHAT_POLL_INTERVAL_MS } from "@/features/chat/constants/chat-poll-interval-ms";
import type { ChatView } from "@/features/chat/types/chat-view";
import { fetchChatView } from "@/features/chat/utils/fetch-chat-view";
import { toChatQueryKey } from "@/features/chat/utils/to-chat-query-key";

interface Props {
  chatId: string;
  // What the server rendered, so the page has the chat on its first paint
  initialView: ChatView;
}

// A chat with someone waiting at its door changes without this page doing anything, so it asks
export const useChatQuery = ({ chatId, initialView }: Props) =>
  useQuery({
    queryKey: toChatQueryKey({ chatId }),
    queryFn: () => fetchChatView({ chatId }),
    initialData: initialView,
    refetchInterval: (query) => (query.state.data?.chat.guest ? false : CHAT_POLL_INTERVAL_MS),
  });
