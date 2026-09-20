"use server";

import { redis } from "@/shared/lib/redis/server";
import type { ActionResponse } from "@/shared/types/action-response";
import type { BaseActionErrorCode } from "@/shared/types/base-action-error-code";
import { generateId } from "@/shared/utils/generate-id";
import { isRateLimited } from "@/shared/utils/is-rate-limited";
import { tryCatch } from "@/shared/utils/try-catch";

import { getSession } from "@/features/auth/queries/get-session";
import { toHandleKey } from "@/features/auth/utils/to-handle-key";
import { toIdentityKey } from "@/features/auth/utils/to-identity-key";
import { CHAT_LIFESPAN_HOURS } from "@/features/chat/constants/chat-lifespan-hours";
import { startChatRateLimits } from "@/features/chat/lib/start-chat-rate-limits";
import type { Chat } from "@/features/chat/types/chat";
import { toChatKey } from "@/features/chat/utils/to-chat-key";
import { toChatsKey } from "@/features/chat/utils/to-chats-key";

/**
 * Opens a chat and waits for someone to be let in. It holds who started it and when it ends, and
 * never a word of what is said in it.
 *
 * The link that invites someone is not made here: the part of it after `#` is the key the two
 * sides will encrypt with, and it is generated in the browser so that no server ever sees it.
 *
 * Both people's identities are kept at least as long as the chat, as a post keeps its author's,
 * so neither side of a conversation disappears in the middle of it.
 */
export const startChat = async (): Promise<ActionResponse<Chat, BaseActionErrorCode>> => {
  const session = await getSession();

  if (!session) {
    return {
      data: null,
      error: { code: "UNAUTHORIZED", message: "You need an identity to do that" },
    };
  }

  if (await isRateLimited({ limits: startChatRateLimits, identityId: session.user.id })) {
    return {
      data: null,
      error: {
        code: "RATE_LIMITED",
        message: "You're starting chats too fast. Try again in a few minutes.",
      },
    };
  }

  const { user } = session;
  const id = generateId();
  const createdAt = Date.now();
  const expiresAt = createdAt + CHAT_LIFESPAN_HOURS * 60 * 60 * 1_000;
  const expiresAtSeconds = Math.ceil(expiresAt / 1_000);
  const key = toChatKey({ id });
  const chats = toChatsKey({ identityId: user.id });

  const { error } = await tryCatch(
    redis
      .multi()
      .hset(key, {
        id,
        creatorId: user.id,
        creatorHandle: user.username,
        creatorName: user.name,
        createdAt: String(createdAt),
        expiresAt: String(expiresAt),
      })
      .expireat(key, expiresAtSeconds)
      .zadd(chats, { score: createdAt, member: id })
      .expireat(chats, expiresAtSeconds)
      .expireat(toIdentityKey({ id: user.id }), expiresAtSeconds, "GT")
      .expireat(toHandleKey({ handle: user.username }), expiresAtSeconds, "GT")
      .exec(),
  );

  if (error) return { data: null, error: { code: "UNKNOWN", message: "Couldn't start the chat" } };

  return {
    data: {
      id,
      creator: { id: user.id, handle: user.username, name: user.name },
      guest: null,
      createdAt: new Date(createdAt),
      expiresAt: new Date(expiresAt),
    },
    error: null,
  };
};
