"use server";

import { and, eq, gt } from "drizzle-orm";

import { comment, post } from "@/shared/lib/drizzle/schema";
import { db } from "@/shared/lib/drizzle/server";
import type { ActionResponse } from "@/shared/types/action-response";
import type { BaseActionErrorCode } from "@/shared/types/base-action-error-code";
import { tryCatch } from "@/shared/utils/try-catch";

import { getSession } from "@/features/auth/queries/get-session";
import { createCommentSchema } from "@/features/comments/schemas/create-comment-schema";
import type { CreateCommentInput } from "@/features/comments/types/create-comment-input";
import type { PostComment } from "@/features/comments/types/post-comment";
import { confirmMediaUploads } from "@/features/media/utils/confirm-media-uploads";
import { toMedia } from "@/features/media/utils/to-media";
import { toMediaAttachQueries } from "@/features/media/utils/to-media-attach-queries";

export const createComment = async (
  values: CreateCommentInput,
): Promise<
  ActionResponse<
    PostComment,
    | "POST_NOT_FOUND"
    | "MEDIA_NOT_FOUND"
    | "INVALID_MEDIA"
    | "FAILED_TO_CONFIRM_MEDIA"
    | BaseActionErrorCode
  >
> => {
  const input = createCommentSchema.safeParse(values);

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

  const { data: live, error: liveError } = await tryCatch(
    db
      .select({ id: post.id })
      .from(post)
      .where(and(eq(post.id, input.data.postId), gt(post.expiresAt, new Date())))
      .limit(1),
  );

  if (liveError) {
    return { data: null, error: { code: "UNKNOWN", message: "Couldn't publish your comment" } };
  }

  if (!live.length) {
    return { data: null, error: { code: "POST_NOT_FOUND", message: "That post is already gone" } };
  }

  const { user } = session;

  const { data: confirmed, error: mediaError } = await confirmMediaUploads({
    uploads: input.data.media,
    userId: user.id,
  });

  if (mediaError) return { data: null, error: mediaError };

  const id = crypto.randomUUID();

  // One batch, so the comment and its file are saved together or not at all
  const { data, error } = await tryCatch(
    db.batch([
      db
        .insert(comment)
        .values({ id, postId: input.data.postId, userId: user.id, content: input.data.content })
        .returning({
          id: comment.id,
          postId: comment.postId,
          content: comment.content,
          createdAt: comment.createdAt,
        }),
      ...toMediaAttachQueries({ confirmed, owner: { commentId: id } }),
    ]),
  );

  const [created] = data?.[0] ?? [];

  if (error || !created) {
    return { data: null, error: { code: "UNKNOWN", message: "Couldn't publish your comment" } };
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
    },
    error: null,
  };
};
