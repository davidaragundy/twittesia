import "server-only";

import { redis } from "@/shared/lib/redis/server";
import type { ActionResponse } from "@/shared/types/action-response";
import { toHashRecord } from "@/shared/utils/to-hash-record";
import { tryCatch } from "@/shared/utils/try-catch";

import type { FeedPost } from "@/features/posts/types/feed-post";
import { toFeedPost } from "@/features/posts/utils/to-feed-post";
import { toPostKey } from "@/features/posts/utils/to-post-key";

interface Props {
  postId: string;
  viewerId?: string | null;
}

// An expired post reads as not found, the same as a deleted one
export const getPost = async ({
  postId,
  viewerId,
}: Props): Promise<ActionResponse<FeedPost, "POST_NOT_FOUND" | "FAILED_TO_LOAD_POST">> => {
  const { data, error } = await tryCatch(redis.hgetall(toPostKey({ id: postId })));

  if (error) {
    return {
      data: null,
      error: { code: "FAILED_TO_LOAD_POST", message: "Couldn't load the post" },
    };
  }

  const hash = toHashRecord({ reply: data });
  const post = Number(hash?.expiresAt) > Date.now() ? toFeedPost({ hash, viewerId }) : null;

  if (!post) {
    return { data: null, error: { code: "POST_NOT_FOUND", message: "That post is gone" } };
  }

  return { data: post, error: null };
};
