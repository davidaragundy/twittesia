import type { Chat } from "@/features/chat/types/chat";
import type { ChatRole } from "@/features/chat/types/chat-role";
import type { Knock } from "@/features/chat/types/knock";

// Everything a reader may know about a chat, which is different for each of the three of them:
// only its creator is told who is waiting, and a visitor is told only whether they are.
export type ChatView = {
  chat: Chat;
  role: ChatRole;
  knocks: Knock[];
  isWaiting: boolean;
};
