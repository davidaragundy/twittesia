import "server-only";

import { redis } from "@/shared/lib/redis/server";
import type { ActionResponse } from "@/shared/types/action-response";
import { tryCatch } from "@/shared/utils/try-catch";

import { DELETE_COMMENT_SCRIPT } from "@/features/comments/constants/delete-comment-script";
import { BLOB_EXPIRY_KEY } from "@/features/media/constants/blob-expiry-key";
import { RANK_SCORE_WEIGHT } from "@/features/posts/constants/rank-score-weight";
import { queryContentKeys } from "@/features/posts/utils/query-content-keys";
import { toPostKey } from "@/features/posts/utils/to-post-key";

interface Props {
  authorId: string;
}

// Deletes every comment an author wrote, each as one step with its post's comment count and rank,
// as if they had deleted them one by one. Their files become due; the caller runs the sweep.
export const deleteAuthorComments = async ({
  authorId,
}: Props): Promise<ActionResponse<null, "FAILED_TO_DELETE_COMMENTS">> => {
  const failure = {
    data: null,
    error: { code: "FAILED_TO_DELETE_COMMENTS" as const, message: "Couldn't delete the comments" },
  };

  const { data: keys, error } = await queryContentKeys({
    filter: { type: "comment", authorId },
  });

  if (error) return failure;
  if (!keys.length) return { data: null, error: null };

  const reads = redis.pipeline();

  for (const key of keys) reads.hget(key, "postId");

  const { data: postIds, error: readError } = await tryCatch(reads.exec<(string | null)[]>());

  if (readError) return failure;

  const now = String(Date.now());
  const deletes = redis.pipeline();

  keys.forEach((key, index) => {
    const postId = postIds[index];

    if (postId) {
      deletes.eval(
        DELETE_COMMENT_SCRIPT,
        [key, toPostKey({ id: postId }), BLOB_EXPIRY_KEY],
        [authorId, String(RANK_SCORE_WEIGHT), now],
      );
    }
  });

  // Every comment the index listed may have gone already, leaving nothing to send
  if (!postIds.some(Boolean)) return { data: null, error: null };

  const { error: deleteError } = await tryCatch(deletes.exec());

  if (deleteError) return failure;

  return { data: null, error: null };
};
