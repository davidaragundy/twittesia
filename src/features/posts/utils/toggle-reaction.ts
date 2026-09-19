import "server-only";

import { redis } from "@/shared/lib/redis/server";
import type { ActionResponse } from "@/shared/types/action-response";
import { tryCatch } from "@/shared/utils/try-catch";

import { RANK_SCORE_WEIGHT } from "@/features/posts/constants/rank-score-weight";
import { TOGGLE_REACTION_SCRIPT } from "@/features/posts/constants/toggle-reaction-script";
import { toReactedKey } from "@/features/posts/utils/to-reacted-key";

interface Props {
  // The post or comment hash
  targetKey: string;
  identityId: string;
  emoji: string;
}

// Adds the emoji when the reader hasn't, and removes it when they have, for a post or a comment
export const toggleReaction = async ({
  targetKey,
  identityId,
  emoji,
}: Props): Promise<
  ActionResponse<{ reacted: boolean }, "TARGET_NOT_FOUND" | "FAILED_TO_TOGGLE_REACTION">
> => {
  const { data, error } = await tryCatch(
    redis.eval<string[], number>(
      TOGGLE_REACTION_SCRIPT,
      [targetKey, toReactedKey({ targetKey, identityId })],
      [emoji, String(Date.now()), String(RANK_SCORE_WEIGHT)],
    ),
  );

  if (error) {
    return {
      data: null,
      error: { code: "FAILED_TO_TOGGLE_REACTION", message: "Couldn't save your reaction" },
    };
  }

  if (Number(data) < 0) {
    return { data: null, error: { code: "TARGET_NOT_FOUND", message: "That's already gone" } };
  }

  return { data: { reacted: Number(data) === 1 }, error: null };
};
