"use server";

import { redis } from "@/shared/lib/redis/server";
import type { ActionResponse } from "@/shared/types/action-response";
import type { BaseActionErrorCode } from "@/shared/types/base-action-error-code";
import { tryCatch } from "@/shared/utils/try-catch";

import { getSession } from "@/features/auth/queries/get-session";
import { toHandleKey } from "@/features/auth/utils/to-handle-key";
import { toIdentityKey } from "@/features/auth/utils/to-identity-key";
import { LIFESPAN_HOURS } from "@/features/posts/constants/lifespan-hours";
import { createPostSchema } from "@/features/posts/schemas/create-post-schema";
import type { CreatePostInput } from "@/features/posts/types/create-post-input";
import type { FeedPost } from "@/features/posts/types/feed-post";
import { getContentIndex } from "@/features/posts/utils/get-content-index";
import { toPostKey } from "@/features/posts/utils/to-post-key";
import { toRank } from "@/features/posts/utils/to-rank";

/**
 * Publishes a post as one hash, expiring at the end of its lifespan. It carries a copy of its
 * author's handle and name, so the feed reads it in one query.
 *
 * The author's identity and handle are kept at least as long as the post (EXPIREAT GT never
 * shortens them), so a post's author always links to a profile that exists. Their session is not:
 * it still ends a day after the identity began.
 */
export const createPost = async (
  values: CreatePostInput,
): Promise<ActionResponse<FeedPost, "INVALID_MEDIA" | BaseActionErrorCode>> => {
  const input = createPostSchema.safeParse(values);

  if (!input.success) {
    return {
      data: null,
      error: { code: "INVALID_INPUT", message: input.error.issues[0]?.message ?? "Invalid input" },
    };
  }

  // Attachments move to Redis in their own step of the migration
  if (input.data.media.length) {
    return {
      data: null,
      error: { code: "INVALID_MEDIA", message: "Attaching files is coming back shortly" },
    };
  }

  const session = await getSession();

  if (!session) {
    return {
      data: null,
      error: { code: "UNAUTHORIZED", message: "You need an identity to do that" },
    };
  }

  const { user } = session;
  const id = crypto.randomUUID();
  const createdAt = Date.now();
  const expiresAt = createdAt + LIFESPAN_HOURS * 60 * 60 * 1_000;
  const expiresAtSeconds = Math.ceil(expiresAt / 1_000);
  const key = toPostKey({ id });

  const { error } = await tryCatch(
    redis
      .multi()
      .hset(key, {
        id,
        type: "post",
        authorId: user.id,
        authorHandle: user.username,
        authorName: user.name,
        content: input.data.content,
        media: "[]",
        reactions: "[]",
        reactionCount: "0",
        commentCount: "0",
        viewCount: "0",
        createdAt: String(createdAt),
        expiresAt: String(expiresAt),
        rank: String(toRank({ score: 0, createdAt })),
      })
      .expireat(key, expiresAtSeconds)
      .expireat(toIdentityKey({ id: user.id }), expiresAtSeconds, "GT")
      .expireat(toHandleKey({ handle: user.username }), expiresAtSeconds, "GT")
      .exec(),
  );

  if (error)
    return { data: null, error: { code: "UNKNOWN", message: "Couldn't publish your post" } };

  // Indexing trails a write, by seconds when the store is busy. Answering once the index has the
  // post means a reload straight after publishing still finds it. The post is saved either way.
  await tryCatch(getContentIndex().waitIndexing());

  return {
    data: {
      id,
      content: input.data.content,
      createdAt: new Date(createdAt),
      author: { name: user.name, username: user.username, displayUsername: user.username },
      isMine: true,
      reactions: [],
      media: [],
      viewCount: 0,
      commentCount: 0,
    },
    error: null,
  };
};
