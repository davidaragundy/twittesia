import { CHAT_PRESENCE_INTERVAL_MS } from "@/features/chat/constants/chat-presence-interval-ms";

// How long the other side counts as here without hearing from them: two missed reminders and a
// little slack, so a slow network never flickers them away
export const CHAT_PRESENCE_FORGET_MS = CHAT_PRESENCE_INTERVAL_MS * 2.5;
