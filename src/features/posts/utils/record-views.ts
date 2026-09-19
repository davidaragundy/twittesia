import "server-only";

import { redis } from "@/shared/lib/redis/server";
import type { ActionResponse } from "@/shared/types/action-response";
import { tryCatch } from "@/shared/utils/try-catch";

import { RECORD_VIEWS_SCRIPT } from "@/features/posts/constants/record-views-script";

interface Props {
  // The post or comment hashes seen
  targetKeys: string[];
  viewerId: string;
}

// One command for a whole batch, whichever mix of posts and comments it holds
export const recordViews = async ({
  targetKeys,
  viewerId,
}: Props): Promise<ActionResponse<{ recorded: number }, "FAILED_TO_RECORD_VIEWS">> => {
  if (!targetKeys.length) return { data: { recorded: 0 }, error: null };

  const { data, error } = await tryCatch(
    redis.eval<string[], number>(RECORD_VIEWS_SCRIPT, targetKeys, [viewerId, String(Date.now())]),
  );

  if (error) {
    return {
      data: null,
      error: { code: "FAILED_TO_RECORD_VIEWS", message: "Couldn't record the views" },
    };
  }

  return { data: { recorded: Number(data) }, error: null };
};
