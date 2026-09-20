"use server";

import type { ActionResponse } from "@/shared/types/action-response";
import type { BaseActionErrorCode } from "@/shared/types/base-action-error-code";
import { generateId } from "@/shared/utils/generate-id";
import { isRateLimited } from "@/shared/utils/is-rate-limited";

import { getSession } from "@/features/auth/queries/get-session";
import { sendMessageRateLimits } from "@/features/chat/lib/send-message-rate-limits";
import { getChat } from "@/features/chat/queries/get-chat";
import { sendMessageSchema } from "@/features/chat/schemas/send-message-schema";
import { isChatParticipant } from "@/features/chat/utils/is-chat-participant";
import { publishChatEvent } from "@/features/chat/utils/publish-chat-event";

interface Props {
  chatId: string;
  // The message, already encrypted by the browser, and the nonce it was encrypted with
  cipher: string;
  iv: string;
}

/**
 * Says something to the one other person in a chat.
 *
 * What arrives here is already a box and a nonce: the text was encrypted in the browser with a
 * key derived partly from the secret in the invite, which never reaches a server. This passes it
 * on without being able to read it, and writes it down nowhere.
 *
 * It comes back to the sender the same way it goes to the other side, so what a page shows is
 * what actually left it rather than what it hoped to send.
 */
export const sendMessage = async ({
  chatId,
  cipher,
  iv,
}: Props): Promise<ActionResponse<null, "CHAT_NOT_FOUND" | BaseActionErrorCode>> => {
  const input = sendMessageSchema.safeParse({ chatId, cipher, iv });

  if (!input.success) {
    return {
      data: null,
      error: { code: "INVALID_INPUT", message: input.error.issues[0]?.message ?? "Invalid input" },
    };
  }

  const session = await getSession();

  if (!session) {
    return {
      data: null,
      error: { code: "UNAUTHORIZED", message: "You need an identity to do that" },
    };
  }

  if (await isRateLimited({ limits: sendMessageRateLimits, identityId: session.user.id })) {
    return {
      data: null,
      error: { code: "RATE_LIMITED", message: "You're sending too fast. Give it a moment." },
    };
  }

  const chat = await getChat({ id: input.data.chatId });

  if (!chat || !isChatParticipant({ chat, identityId: session.user.id })) {
    return { data: null, error: { code: "CHAT_NOT_FOUND", message: "That chat has gone" } };
  }

  const sent = await publishChatEvent({
    chatId: chat.id,
    event: {
      type: "message",
      id: generateId(),
      authorId: session.user.id,
      cipher: input.data.cipher,
      iv: input.data.iv,
      sentAt: Date.now(),
    },
  });

  if (!sent) {
    return { data: null, error: { code: "UNKNOWN", message: "Couldn't send that" } };
  }

  return { data: null, error: null };
};
