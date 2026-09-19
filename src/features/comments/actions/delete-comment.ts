"use server";

import { z } from "zod";

import { redis } from "@/shared/lib/redis/server";
import type { ActionResponse } from "@/shared/types/action-response";
import type { BaseActionErrorCode } from "@/shared/types/base-action-error-code";
import { tryCatch } from "@/shared/utils/try-catch";

import { getSession } from "@/features/auth/queries/get-session";
import { DELETE_COMMENT_SCRIPT } from "@/features/comments/constants/delete-comment-script";
import { toCommentKey } from "@/features/comments/utils/to-comment-key";
import { RANK_SCORE_WEIGHT } from "@/features/posts/constants/rank-score-weight";
import { toPostKey } from "@/features/posts/utils/to-post-key";

// Only the author can delete a comment. Someone else's comment reads as already gone, so nobody
// learns anything by trying.
export const deleteComment = async (
  commentId: string,
): Promise<ActionResponse<null, "COMMENT_NOT_FOUND" | BaseActionErrorCode>> => {
  const input = z.string().min(1).safeParse(commentId);

  if (!input.success) {
    return { data: null, error: { code: "INVALID_INPUT", message: "Invalid comment" } };
  }

  const session = await getSession();

  if (!session) {
    return {
      data: null,
      error: { code: "UNAUTHORIZED", message: "You need an identity to do that" },
    };
  }

  const failure = {
    data: null,
    error: { code: "UNKNOWN" as const, message: "Couldn't delete your comment" },
  };
  const gone = {
    data: null,
    error: { code: "COMMENT_NOT_FOUND" as const, message: "That comment is already gone" },
  };

  const key = toCommentKey({ id: input.data });
  const { data: postId, error: readError } = await tryCatch(redis.hget<string>(key, "postId"));

  if (readError) return failure;
  if (!postId) return gone;

  const { data: deleted, error } = await tryCatch(
    redis.eval<string[], number>(
      DELETE_COMMENT_SCRIPT,
      [key, toPostKey({ id: postId })],
      [session.user.id, String(RANK_SCORE_WEIGHT)],
    ),
  );

  if (error) return failure;
  if (Number(deleted) !== 1) return gone;

  return { data: null, error: null };
};
