"use server";

import type { ActionResponse } from "@/shared/types/action-response";
import type { BaseActionErrorCode } from "@/shared/types/base-action-error-code";

import { getSession } from "@/features/auth/queries/get-session";
import { toggleCommentReactionSchema } from "@/features/comments/schemas/toggle-comment-reaction-schema";
import type { ToggleCommentReactionInput } from "@/features/comments/types/toggle-comment-reaction-input";
import { toCommentKey } from "@/features/comments/utils/to-comment-key";
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

  return { data, error: null };
};
