"use server";

import { and, eq, gt } from "drizzle-orm";

import { post, postReaction } from "@/shared/lib/drizzle/schema";
import { db } from "@/shared/lib/drizzle/server";
import type { ActionResponse } from "@/shared/types/action-response";
import type { BaseActionErrorCode } from "@/shared/types/base-action-error-code";
import { tryCatch } from "@/shared/utils/try-catch";

import { getSession } from "@/features/auth/queries/get-session";
import { togglePostReactionSchema } from "@/features/posts/schemas/toggle-post-reaction-schema";
import type { TogglePostReactionInput } from "@/features/posts/types/toggle-post-reaction-input";

// Removes the reaction when the user already added it, and adds it otherwise
export const togglePostReaction = async (
  values: TogglePostReactionInput,
): Promise<ActionResponse<{ reacted: boolean }, "POST_NOT_FOUND" | BaseActionErrorCode>> => {
  const input = togglePostReactionSchema.safeParse(values);

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

  const { postId, emoji } = input.data;
  const userId = session.user.id;

  const { data: live, error: liveError } = await tryCatch(
    db
      .select({ id: post.id })
      .from(post)
      .where(and(eq(post.id, postId), gt(post.expiresAt, new Date())))
      .limit(1),
  );

  if (liveError) {
    return { data: null, error: { code: "UNKNOWN", message: "Couldn't save your reaction" } };
  }

  if (!live.length) {
    return { data: null, error: { code: "POST_NOT_FOUND", message: "That post is already gone" } };
  }

  const { data: removed, error: removeError } = await tryCatch(
    db
      .delete(postReaction)
      .where(
        and(
          eq(postReaction.postId, postId),
          eq(postReaction.userId, userId),
          eq(postReaction.reaction, emoji),
        ),
      )
      .returning({ postId: postReaction.postId }),
  );

  if (removeError) {
    return { data: null, error: { code: "UNKNOWN", message: "Couldn't save your reaction" } };
  }

  if (removed.length) return { data: { reacted: false }, error: null };

  const { error: addError } = await tryCatch(
    db.insert(postReaction).values({ postId, userId, reaction: emoji }).onConflictDoNothing(),
  );

  if (addError) {
    return { data: null, error: { code: "UNKNOWN", message: "Couldn't save your reaction" } };
  }

  return { data: { reacted: true }, error: null };
};
