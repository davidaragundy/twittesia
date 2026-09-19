import "server-only";

import type { ActionResponse } from "@/shared/types/action-response";
import { tryCatch } from "@/shared/utils/try-catch";

import { getContentIndex } from "@/features/posts/utils/get-content-index";
import type { ProfileStats } from "@/features/profiles/types/profile-stats";

interface Props {
  userId: string;
}

// What one person has alive right now, in one aggregation over the index: their posts and
// comments counted by type, and the reactions and views on each summed. Expiry is part of the
// filter, so nothing the index still lists a moment after it expired is counted.
export const getProfileStats = async ({
  userId,
}: Props): Promise<ActionResponse<ProfileStats, "FAILED_TO_LOAD_STATS">> => {
  const { data, error } = await tryCatch(
    getContentIndex().aggregate({
      filter: { authorId: userId, expiresAt: { $gt: Date.now() } },
      aggregations: {
        byType: {
          $terms: { field: "type" },
          $aggs: {
            reactions: { $sum: { field: "reactionCount", missing: 0 } },
            views: { $sum: { field: "viewCount", missing: 0 } },
          },
        },
      },
    }),
  );

  if (error) {
    return {
      data: null,
      error: { code: "FAILED_TO_LOAD_STATS", message: "Couldn't load the profile's counts" },
    };
  }

  const posts = data.byType.buckets.find((bucket) => bucket.key === "post");
  const comments = data.byType.buckets.find((bucket) => bucket.key === "comment");

  return {
    data: {
      postCount: posts?.docCount ?? 0,
      commentCount: comments?.docCount ?? 0,
      reactionCount: (posts?.reactions.value ?? 0) + (comments?.reactions.value ?? 0),
      viewCount: (posts?.views.value ?? 0) + (comments?.views.value ?? 0),
    },
    error: null,
  };
};
