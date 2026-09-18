"use server";

import { post } from "@/shared/lib/drizzle/schema";
import { db } from "@/shared/lib/drizzle/server";
import type { ActionResponse } from "@/shared/types/action-response";
import type { BaseActionErrorCode } from "@/shared/types/base-action-error-code";
import { tryCatch } from "@/shared/utils/try-catch";

import { getSession } from "@/features/auth/queries/get-session";
import { confirmMediaUploads } from "@/features/media/utils/confirm-media-uploads";
import { toMedia } from "@/features/media/utils/to-media";
import { toMediaAttachQueries } from "@/features/media/utils/to-media-attach-queries";
import { LIFESPAN_HOURS } from "@/features/posts/constants/lifespan-hours";
import { createPostSchema } from "@/features/posts/schemas/create-post-schema";
import type { CreatePostInput } from "@/features/posts/types/create-post-input";
import type { FeedPost } from "@/features/posts/types/feed-post";

// Files never pass through here: the browser has already sent them to Blob, and this only takes
// their paths, which are checked against the store before anything is saved
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

  const { user } = session;

  const { data: confirmed, error: mediaError } = await confirmMediaUploads({
    uploads: input.data.media,
    userId: user.id,
  });

  if (mediaError) return { data: null, error: mediaError };

  const id = crypto.randomUUID();
  const createdAt = new Date();
  const expiresAt = new Date(createdAt.getTime() + LIFESPAN_HOURS * 60 * 60 * 1_000);

  // One batch, so the post and its files are saved together or not at all
  const { data, error } = await tryCatch(
    db.batch([
      db
        .insert(post)
        .values({ id, userId: user.id, content: input.data.content, createdAt, expiresAt })
        .returning({ id: post.id, content: post.content, createdAt: post.createdAt }),
      ...toMediaAttachQueries({ confirmed, owner: { postId: id } }),
    ]),
  );

  const [created] = data?.[0] ?? [];

  if (error || !created) {
    return { data: null, error: { code: "UNKNOWN", message: "Couldn't publish your post" } };
  }

  return {
    data: {
      ...created,
      author: {
        name: user.name,
        username: user.username ?? "",
        displayUsername: user.displayUsername ?? user.username ?? "",
      },
      isMine: true,
      reactions: [],
      media: confirmed.map((item) => toMedia({ confirmed: item })),
      viewCount: 0,
      commentCount: 0,
    },
    error: null,
  };
};
