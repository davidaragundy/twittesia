"use server";

import { redis } from "@/shared/lib/redis/server";
import type { ActionResponse } from "@/shared/types/action-response";
import type { BaseActionErrorCode } from "@/shared/types/base-action-error-code";
import { isRateLimited } from "@/shared/utils/is-rate-limited";
import { tryCatch } from "@/shared/utils/try-catch";

import { getSession } from "@/features/auth/queries/get-session";
import { toHandleKey } from "@/features/auth/utils/to-handle-key";
import { toIdentityKey } from "@/features/auth/utils/to-identity-key";
import { BLOB_EXPIRY_KEY } from "@/features/media/constants/blob-expiry-key";
import { confirmMediaUploads } from "@/features/media/utils/confirm-media-uploads";
import { toMedia } from "@/features/media/utils/to-media";
import { toMediaFields } from "@/features/media/utils/to-media-fields";
import { toUploadKey } from "@/features/media/utils/to-upload-key";
import { LIFESPAN_HOURS } from "@/features/posts/constants/lifespan-hours";
import { createPostRateLimits } from "@/features/posts/lib/create-post-rate-limits";
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
): Promise<
  ActionResponse<
    FeedPost,
    "MEDIA_NOT_FOUND" | "INVALID_MEDIA" | "FAILED_TO_CONFIRM_MEDIA" | BaseActionErrorCode
  >
> => {
  const input = createPostSchema.safeParse(values);

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

  if (await isRateLimited({ limits: createPostRateLimits, identityId: session.user.id })) {
    return {
      data: null,
      error: {
        code: "RATE_LIMITED",
        message: "You're posting too fast. Try again in a few minutes.",
      },
    };
  }

  const { user } = session;

  // Files never pass through here: the browser has already sent them to Blob, and only their
  // paths arrive, checked against the store before anything is saved
  const { data: confirmed, error: mediaError } = await confirmMediaUploads({
    uploads: input.data.media,
    userId: user.id,
  });

  if (mediaError) return { data: null, error: mediaError };

  const id = crypto.randomUUID();
  const createdAt = Date.now();
  const expiresAt = createdAt + LIFESPAN_HOURS * 60 * 60 * 1_000;
  const expiresAtSeconds = Math.ceil(expiresAt / 1_000);
  const key = toPostKey({ id });

  const transaction = redis
    .multi()
    .hset(key, {
      id,
      type: "post",
      authorId: user.id,
      authorHandle: user.username,
      authorName: user.name,
      content: input.data.content,
      ...toMediaFields({ confirmed }),
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
    .expireat(toHandleKey({ handle: user.username }), expiresAtSeconds, "GT");

  // In the same transaction, its files become due when the post is, and stop waiting to be
  // attached, so a file is never both attached and swept
  const [first, ...rest] = confirmed.map((item) => ({ score: expiresAt, member: item.pathname }));

  if (first) {
    transaction
      .zadd(BLOB_EXPIRY_KEY, first, ...rest)
      .del(...confirmed.map((item) => toUploadKey({ pathname: item.pathname })));
  }

  const { error } = await tryCatch(transaction.exec());

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
      media: confirmed.map((item) => toMedia({ confirmed: item })),
      viewCount: 0,
      commentCount: 0,
    },
    error: null,
  };
};
