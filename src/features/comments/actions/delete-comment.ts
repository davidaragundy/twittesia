"use server";

import { and, eq } from "drizzle-orm";
import { after } from "next/server";
import { z } from "zod";

import { comment } from "@/shared/lib/drizzle/schema";
import { db } from "@/shared/lib/drizzle/server";
import type { ActionResponse } from "@/shared/types/action-response";
import type { BaseActionErrorCode } from "@/shared/types/base-action-error-code";
import { tryCatch } from "@/shared/utils/try-catch";

import { getSession } from "@/features/auth/queries/get-session";
import { sweepOrphanedMedia } from "@/features/media/utils/sweep-orphaned-media";

// Only the author can delete a comment
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

  const { data, error } = await tryCatch(
    db
      .delete(comment)
      .where(and(eq(comment.id, input.data), eq(comment.userId, session.user.id)))
      .returning({ id: comment.id }),
  );

  if (error) {
    return { data: null, error: { code: "UNKNOWN", message: "Couldn't delete your comment" } };
  }

  if (!data.length) {
    return {
      data: null,
      error: { code: "COMMENT_NOT_FOUND", message: "That comment is already gone" },
    };
  }

  // Its file is left with no owner; it leaves Blob once the answer has been sent
  after(sweepOrphanedMedia);

  return { data: null, error: null };
};
