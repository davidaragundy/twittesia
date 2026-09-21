import { CHAT_RUN_GAP_MS } from "@/features/chat/constants/chat-run-gap-ms";
import type { ChatMessage } from "@/features/chat/types/chat-message";

// Consecutive messages from one side, a few minutes apart at most, read as one run: one group of
// bubbles with one time under it, the way people write in bursts
export const groupChatMessages = (messages: ChatMessage[]) =>
  messages.reduce<ChatMessage[][]>((runs, message) => {
    const run = runs.at(-1);
    const previous = run?.at(-1);
    const continues =
      !!previous &&
      previous.isMine === message.isMine &&
      message.sentAt.getTime() - previous.sentAt.getTime() < CHAT_RUN_GAP_MS;

    return continues && run ? [...runs.slice(0, -1), [...run, message]] : [...runs, [message]];
  }, []);
