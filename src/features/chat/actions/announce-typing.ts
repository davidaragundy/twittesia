"use server";

import type { ActionResponse } from "@/shared/types/action-response";
import type { BaseActionErrorCode } from "@/shared/types/base-action-error-code";
import { isRateLimited } from "@/shared/utils/is-rate-limited";

import { getSession } from "@/features/auth/queries/get-session";
import { typingRateLimits } from "@/features/chat/lib/typing-rate-limits";
import { getChat } from "@/features/chat/queries/get-chat";
import { chatIdSchema } from "@/features/chat/schemas/chat-id-schema";
import { isChatParticipant } from "@/features/chat/utils/is-chat-participant";
import { publishChatEvent } from "@/features/chat/utils/publish-chat-event";

interface Props {
  chatId: string;
}

/**
 * Says that this side is writing something.
 *
 * It says nothing about what, and it is gone the moment it has been passed on: the other side
 * forgets it by itself after a few seconds, so a page that closes mid-word stops saying it
 * without having to.
 */
export const announceTyping = async ({
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

  if (await isRateLimited({ limits: typingRateLimits, identityId: session.user.id })) {
    return { data: null, error: { code: "RATE_LIMITED", message: "Too many at once" } };
  }

  const chat = await getChat({ id: input.data });

  if (!chat || !isChatParticipant({ chat, identityId: session.user.id })) {
    return { data: null, error: { code: "CHAT_NOT_FOUND", message: "That chat has gone" } };
  }

  await publishChatEvent({
    chatId: chat.id,
    event: { type: "typing", identityId: session.user.id },
  });

  return { data: null, error: null };
};
