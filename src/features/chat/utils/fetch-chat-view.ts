import type { ChatView } from "@/features/chat/types/chat-view";

interface Props {
  chatId: string;
}

type SerializedChatView = {
  chat: Omit<ChatView["chat"], "createdAt" | "expiresAt"> & {
    createdAt: string;
    expiresAt: string;
  };
  role: ChatView["role"];
  knocks: (Omit<ChatView["knocks"][number], "knockedAt"> & { knockedAt: string })[];
  isWaiting: boolean;
};

// JSON has no dates, so the timestamps come back as strings
export const fetchChatView = async ({ chatId }: Props): Promise<ChatView> => {
  const response = await fetch(`/api/chats/${chatId}`);

  if (!response.ok) throw new Error("Couldn't read the chat");

  const view: SerializedChatView = await response.json();

  return {
    ...view,
    chat: {
      ...view.chat,
      createdAt: new Date(view.chat.createdAt),
      expiresAt: new Date(view.chat.expiresAt),
    },
    knocks: view.knocks.map((knock) => ({ ...knock, knockedAt: new Date(knock.knockedAt) })),
  };
};
