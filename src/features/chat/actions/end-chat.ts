"use server";

import { redis } from "@/shared/lib/redis/server";
import type { ActionResponse } from "@/shared/types/action-response";
import type { BaseActionErrorCode } from "@/shared/types/base-action-error-code";
import { tryCatch } from "@/shared/utils/try-catch";

import { getSession } from "@/features/auth/queries/get-session";
import { getChat } from "@/features/chat/queries/get-chat";
import { chatIdSchema } from "@/features/chat/schemas/chat-id-schema";
import { isChatParticipant } from "@/features/chat/utils/is-chat-participant";
import { publishChatEvent } from "@/features/chat/utils/publish-chat-event";
import { toChatKey } from "@/features/chat/utils/to-chat-key";
import { toChatsKey } from "@/features/chat/utils/to-chats-key";
import { toKnocksKey } from "@/features/chat/utils/to-knocks-key";

interface Props {
  chatId: string;
}

/**
 * Ends a chat now rather than at its expiry, for either of the two people in it.
 *
 * There is nothing to delete but the chat itself: what was said was never written down. Both
 * rooms are told, so neither is left talking to a chat that has gone, and the connections close
 * on their own once there is nothing to be in.
 *
 * Either side may do it, and it cannot be undone: a chat that has ended reads the same as one
 * that never existed.
 */
export const endChat = async ({
  chatId,
}: Props): Promise<ActionResponse<null, "CHAT_NOT_FOUND" | BaseActionErrorCode>> => {
  const input = chatIdSchema.safeParse(chatId);

  if (!input.success) {
    return { data: null, error: { code: "INVALID_INPUT", message: "That isn't a chat" } };
  }

  const session = await getSession();

  if (!session) {
    return {
      data: null,
      error: { code: "UNAUTHORIZED", message: "You need an identity to do that" },
    };
  }

  const chat = await getChat({ id: input.data });

  if (!chat || !isChatParticipant({ chat, identityId: session.user.id })) {
    return { data: null, error: { code: "CHAT_NOT_FOUND", message: "That chat has gone" } };
  }

  const transaction = redis
    .multi()
    .del(toChatKey({ id: chat.id }), toKnocksKey({ chatId: chat.id }))
    .zrem(toChatsKey({ identityId: chat.creator.id }), chat.id);

  if (chat.guest) transaction.zrem(toChatsKey({ identityId: chat.guest.id }), chat.id);

  const { error } = await tryCatch(transaction.exec());

  if (error) return { data: null, error: { code: "UNKNOWN", message: "Couldn't end the chat" } };

  // Whoever is still in it hears it from their own room rather than from a page that stops working
  await publishChatEvent({
    chatId: chat.id,
    event: { type: "ended", identityId: session.user.id },
  });

  return { data: null, error: null };
};
