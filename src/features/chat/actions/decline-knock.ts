"use server";

import { redis } from "@/shared/lib/redis/server";
import type { ActionResponse } from "@/shared/types/action-response";
import type { BaseActionErrorCode } from "@/shared/types/base-action-error-code";
import { tryCatch } from "@/shared/utils/try-catch";

import { getSession } from "@/features/auth/queries/get-session";
import { getChat } from "@/features/chat/queries/get-chat";
import { knockDecisionSchema } from "@/features/chat/schemas/knock-decision-schema";
import { toKnocksKey } from "@/features/chat/utils/to-knocks-key";

interface Props {
  chatId: string;
  identityId: string;
}

/**
 * Turns down one of the people waiting. They are told nothing: the chat simply stops showing them
 * as waiting, and they may knock again.
 */
export const declineKnock = async ({
  chatId,
  identityId,
}: Props): Promise<ActionResponse<null, "CHAT_NOT_FOUND" | BaseActionErrorCode>> => {
  const input = knockDecisionSchema.safeParse({ chatId, identityId });

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

  const chat = await getChat({ id: input.data.chatId });

  if (!chat || chat.creator.id !== session.user.id) {
    return { data: null, error: { code: "CHAT_NOT_FOUND", message: "That chat has gone" } };
  }

  const { error } = await tryCatch(
    redis.hdel(toKnocksKey({ chatId: chat.id }), input.data.identityId),
  );

  if (error) return { data: null, error: { code: "UNKNOWN", message: "Couldn't turn them down" } };

  return { data: null, error: null };
};
