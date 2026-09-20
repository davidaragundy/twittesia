"use server";

import { redis } from "@/shared/lib/redis/server";
import type { ActionResponse } from "@/shared/types/action-response";
import type { BaseActionErrorCode } from "@/shared/types/base-action-error-code";
import { isRateLimited } from "@/shared/utils/is-rate-limited";
import { tryCatch } from "@/shared/utils/try-catch";

import { getSession } from "@/features/auth/queries/get-session";
import { KNOCK_SCRIPT } from "@/features/chat/constants/knock-script";
import { MAX_KNOCKS } from "@/features/chat/constants/max-knocks";
import { knockRateLimits } from "@/features/chat/lib/knock-rate-limits";
import { knockSchema } from "@/features/chat/schemas/knock-schema";
import { toChatKey } from "@/features/chat/utils/to-chat-key";
import { toKnocksKey } from "@/features/chat/utils/to-knocks-key";

interface Props {
  chatId: string;
}

/**
 * Asks to be let into a chat, as the person who followed its link.
 *
 * What the creator is shown is read from the session rather than sent from the browser: a handle
 * is the only thing they have to go on, so it is the store's copy of it or nothing. Knocking
 * again on the same chat only refreshes what they see.
 */
export const knock = async ({
  chatId,
}: Props): Promise<
  ActionResponse<
    null,
    "CHAT_NOT_FOUND" | "CHAT_FULL" | "CHAT_IS_YOURS" | "TOO_MANY_KNOCKS" | BaseActionErrorCode
  >
> => {
  const input = knockSchema.safeParse({ chatId });

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

  if (await isRateLimited({ limits: knockRateLimits, identityId: session.user.id })) {
    return {
      data: null,
      error: {
        code: "RATE_LIMITED",
        message: "You're asking too often. Try again in a few minutes.",
      },
    };
  }

  const { user } = session;

  const { data, error } = await tryCatch(
    redis.eval<string[], number>(
      KNOCK_SCRIPT,
      [toChatKey({ id: input.data.chatId }), toKnocksKey({ chatId: input.data.chatId })],
      [
        user.id,
        JSON.stringify({ handle: user.username, name: user.name, knockedAt: Date.now() }),
        String(Date.now()),
        String(MAX_KNOCKS),
      ],
    ),
  );

  if (error) return { data: null, error: { code: "UNKNOWN", message: "Couldn't ask to join" } };

  const outcome = Number(data);

  if (outcome === -1) {
    return { data: null, error: { code: "CHAT_NOT_FOUND", message: "That chat has gone" } };
  }

  if (outcome === -2) {
    return {
      data: null,
      error: { code: "CHAT_FULL", message: "Someone else is already in that chat" },
    };
  }

  if (outcome === -3) {
    return { data: null, error: { code: "CHAT_IS_YOURS", message: "That chat is yours" } };
  }

  if (outcome === -4) {
    return {
      data: null,
      error: { code: "TOO_MANY_KNOCKS", message: "Too many people are waiting on that chat" },
    };
  }

  return { data: null, error: null };
};
