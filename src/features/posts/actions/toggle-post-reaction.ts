"use server";

import type { ActionResponse } from "@/shared/types/action-response";
import type { BaseActionErrorCode } from "@/shared/types/base-action-error-code";
import { isRateLimited } from "@/shared/utils/is-rate-limited";

import { getSession } from "@/features/auth/queries/get-session";
import { reactionRateLimits } from "@/features/posts/lib/reaction-rate-limits";
import { togglePostReactionSchema } from "@/features/posts/schemas/toggle-post-reaction-schema";
import type { TogglePostReactionInput } from "@/features/posts/types/toggle-post-reaction-input";
import { toPostKey } from "@/features/posts/utils/to-post-key";
import { toggleReaction } from "@/features/posts/utils/toggle-reaction";

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

  if (await isRateLimited({ limits: reactionRateLimits, identityId: session.user.id })) {
    return {
      data: null,
      error: { code: "RATE_LIMITED", message: "You're reacting too fast. Try again in a minute." },
    };
  }

  const { data, error } = await toggleReaction({
    targetKey: toPostKey({ id: input.data.postId }),
    identityId: session.user.id,
    emoji: input.data.emoji,
  });

  if (error?.code === "TARGET_NOT_FOUND") {
    return { data: null, error: { code: "POST_NOT_FOUND", message: "That post is already gone" } };
  }

  if (error) return { data: null, error: { code: "UNKNOWN", message: error.message } };

  return { data, error: null };
};
