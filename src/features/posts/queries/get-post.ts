import "server-only";

import type { ActionResponse } from "@/shared/types/action-response";
import { tryCatch } from "@/shared/utils/try-catch";

import type { FeedPost } from "@/features/posts/types/feed-post";
import { readContentHashes } from "@/features/posts/utils/read-content-hashes";
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
  const { data, error } = await tryCatch(
    readContentHashes({ keys: [toPostKey({ id: postId })], viewerId }),
  );

  if (error) {
    return {
      data: null,
      error: { code: "FAILED_TO_LOAD_POST", message: "Couldn't load the post" },
    };
  }

  const [read] = data;
  const post =
    read && Number(read.hash?.expiresAt) > Date.now()
      ? toFeedPost({ hash: read.hash, viewerId, mine: read.mine })
      : null;

  if (!post) {
    return { data: null, error: { code: "POST_NOT_FOUND", message: "That post is gone" } };
  }

  return { data: post, error: null };
};
