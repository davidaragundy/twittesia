"use server";

import { after } from "next/server";

import type { ActionResponse } from "@/shared/types/action-response";
import type { BaseActionErrorCode } from "@/shared/types/base-action-error-code";
import { isRateLimited } from "@/shared/utils/is-rate-limited";

import { getSession } from "@/features/auth/queries/get-session";
import { toggleCommentReactionSchema } from "@/features/comments/schemas/toggle-comment-reaction-schema";
import type { ToggleCommentReactionInput } from "@/features/comments/types/toggle-comment-reaction-input";
import { toCommentKey } from "@/features/comments/utils/to-comment-key";
import { reactionRateLimits } from "@/features/posts/lib/reaction-rate-limits";
import { emitContentReacted } from "@/features/posts/utils/emit-content-reacted";
import { toggleReaction } from "@/features/posts/utils/toggle-reaction";

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

  if (await isRateLimited({ limits: reactionRateLimits, identityId: session.user.id })) {
    return {
      data: null,
      error: { code: "RATE_LIMITED", message: "You're reacting too fast. Try again in a minute." },
    };
  }

  const { data, error } = await toggleReaction({
    targetKey: toCommentKey({ id: input.data.commentId }),
    identityId: session.user.id,
    emoji: input.data.emoji,
  });

  if (error?.code === "TARGET_NOT_FOUND") {
    return {
      data: null,
      error: { code: "COMMENT_NOT_FOUND", message: "That comment is already gone" },
    };
  }

  if (error) return { data: null, error: { code: "UNKNOWN", message: error.message } };

  after(
    emitContentReacted({
      targetKey: toCommentKey({ id: input.data.commentId }),
      id: input.data.commentId,
      type: "comment",
      authorId: session.user.id,
    }),
  );

  return { data, error: null };
};
