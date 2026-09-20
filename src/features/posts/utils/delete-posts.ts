import "server-only";

import { redis } from "@/shared/lib/redis/server";
import type { ActionResponse } from "@/shared/types/action-response";
import { tryCatch } from "@/shared/utils/try-catch";

import { markMediaDue } from "@/features/media/utils/mark-media-due";
import { POSTS_PER_COMMENT_QUERY } from "@/features/posts/constants/posts-per-comment-query";
import { queryContentKeys } from "@/features/posts/utils/query-content-keys";
import { toReactedKey } from "@/features/posts/utils/to-reacted-key";

interface Props {
  keys: string[];
}

/**
 * Deletes posts with every comment on them, whoever wrote it, and who reacted to each.
 *
 * Their files become due before the hashes that list them go, so a failure halfway leaves files
 * swept early rather than files nobody will ever sweep. The caller runs the sweep.
 */
export const deletePosts = async ({
  keys,
}: Props): Promise<ActionResponse<null, "FAILED_TO_DELETE_POSTS">> => {
  const failure = {
    data: null,
    error: { code: "FAILED_TO_DELETE_POSTS" as const, message: "Couldn't delete the posts" },
  };

  if (!keys.length) return { data: null, error: null };

  const postReads = redis.pipeline();

  for (const key of keys) postReads.hget(key, "id").hget(key, "mediaPaths");

  const { data: postFields, error: postsError } = await tryCatch(
    postReads.exec<(string | null)[]>(),
  );

  if (postsError) return failure;

  // Two replies per post, its id and then its paths
  const ids = postFields.filter((_, index) => index % 2 === 0).flatMap((id) => (id ? [id] : []));
  const postMediaPaths = postFields.filter((_, index) => index % 2 === 1);
  const commentKeys: string[] = [];

  // Only comments have a postId, so one clause per post finds nothing else
  for (let start = 0; start < ids.length; start += POSTS_PER_COMMENT_QUERY) {
    const { data, error } = await queryContentKeys({
      filter: {
        $or: ids.slice(start, start + POSTS_PER_COMMENT_QUERY).map((postId) => ({ postId })),
      },
    });

    if (error) return failure;

    commentKeys.push(...data);
  }

  const commentReads = redis.pipeline();

  for (const key of commentKeys) commentReads.hget(key, "mediaPaths");

  const { data: commentMediaPaths, error: commentsError } = commentKeys.length
    ? await tryCatch(commentReads.exec<(string | null)[]>())
    : { data: [], error: null };

  if (commentsError) return failure;

  await markMediaDue({
    mediaPaths: [...postMediaPaths, ...commentMediaPaths],
  });

  const contentKeys = [...keys, ...commentKeys];

  const { error } = await tryCatch(
    redis.del(...contentKeys, ...contentKeys.map((targetKey) => toReactedKey({ targetKey }))),
  );

  if (error) return failure;

  return { data: null, error: null };
};
