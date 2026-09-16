"use server";

import { and, eq, gt } from "drizzle-orm";

import { comment, commentReaction, post } from "@/shared/lib/drizzle/schema";
import { db } from "@/shared/lib/drizzle/server";
import type { ActionResponse } from "@/shared/types/action-response";
import type { BaseActionErrorCode } from "@/shared/types/base-action-error-code";
import { tryCatch } from "@/shared/utils/try-catch";

import { getSession } from "@/features/auth/queries/get-session";
import { toggleCommentReactionSchema } from "@/features/comments/schemas/toggle-comment-reaction-schema";
import type { ToggleCommentReactionInput } from "@/features/comments/types/toggle-comment-reaction-input";

// Removes the reaction when the user already added it, and adds it otherwise
export const toggleCommentReaction = async (
  values: ToggleCommentReactionInput,
): Promise<ActionResponse<{ reacted: boolean }, "COMMENT_NOT_FOUND" | BaseActionErrorCode>> => {
  const input = toggleCommentReactionSchema.safeParse(values);

  if (!input.success) {
    return { data: null, error: { code: "INVALID_INPUT", message: "Invalid reaction" } };
  }

  const session = await getSession();

  if (!session) {
    return {
      data: null,
      error: { code: "UNAUTHORIZED", message: "You need an identity to do that" },
    };
  }

  const { commentId, emoji } = input.data;
  const userId = session.user.id;

  const { data: live, error: liveError } = await tryCatch(
    db
      .select({ id: comment.id })
      .from(comment)
      .innerJoin(post, eq(post.id, comment.postId))
      .where(and(eq(comment.id, commentId), gt(post.expiresAt, new Date())))
      .limit(1),
  );

  if (liveError) {
    return { data: null, error: { code: "UNKNOWN", message: "Couldn't save your reaction" } };
  }

  if (!live.length) {
    return {
      data: null,
      error: { code: "COMMENT_NOT_FOUND", message: "That comment is already gone" },
    };
  }

  const { data: removed, error: removeError } = await tryCatch(
    db
      .delete(commentReaction)
      .where(
        and(
          eq(commentReaction.commentId, commentId),
          eq(commentReaction.userId, userId),
          eq(commentReaction.reaction, emoji),
        ),
      )
      .returning({ commentId: commentReaction.commentId }),
  );

  if (removeError) {
    return { data: null, error: { code: "UNKNOWN", message: "Couldn't save your reaction" } };
  }

  if (removed.length) return { data: { reacted: false }, error: null };

  const { error: addError } = await tryCatch(
    db.insert(commentReaction).values({ commentId, userId, reaction: emoji }).onConflictDoNothing(),
  );

  if (addError) {
    return { data: null, error: { code: "UNKNOWN", message: "Couldn't save your reaction" } };
  }

  return { data: { reacted: true }, error: null };
};
