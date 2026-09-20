import { CHAT_KEY_ALGORITHM } from "@/features/chat/constants/chat-key-algorithm";

/**
 * A fresh key pair for one side of one chat, made in the browser.
 *
 * It exists for as long as the page does. Nothing sends the private half anywhere, and nothing
 * writes either half down: closing the page ends this chat's keys with it.
 */
export const generateChatKeyPair = () =>
  crypto.subtle.generateKey(CHAT_KEY_ALGORITHM, true, ["deriveBits"]);
