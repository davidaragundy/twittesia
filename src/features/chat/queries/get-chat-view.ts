import "server-only";

import { getChat } from "@/features/chat/queries/get-chat";
import { getKnocks } from "@/features/chat/queries/get-knocks";
import type { ChatView } from "@/features/chat/types/chat-view";

interface Props {
  id: string;
  // The reader, which decides what of the chat they are told
  viewerId: string;
}

/**
 * A chat as one reader may know it.
 *
 * Its creator is told who is waiting; the person let in is told neither that nor anything about
 * anyone else who asked. Someone at the door is told the chat exists, who started it, and whether
 * they are waiting on it — enough to knock, and nothing about the conversation.
 */
export const getChatView = async ({ id, viewerId }: Props): Promise<ChatView | null> => {
  const chat = await getChat({ id });

  if (!chat) return null;

  if (chat.creator.id === viewerId) {
    return { chat, role: "creator", knocks: await getKnocks({ chatId: id }), isWaiting: false };
  }

  if (chat.guest?.id === viewerId) {
    return { chat, role: "guest", knocks: [], isWaiting: false };
  }

  // A chat with two people in it has nobody waiting, and tells a third person nothing more
  const isWaiting =
    !chat.guest && (await getKnocks({ chatId: id })).some((knock) => knock.identityId === viewerId);

  return { chat, role: "visitor", knocks: [], isWaiting };
};
