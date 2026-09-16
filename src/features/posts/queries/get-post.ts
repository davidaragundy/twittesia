import "server-only";

import { and, eq, gt } from "drizzle-orm";

import { post } from "@/shared/lib/drizzle/schema";
import type { ActionResponse } from "@/shared/types/action-response";

import type { FeedPost } from "@/features/posts/types/feed-post";
import { readFeedPosts } from "@/features/posts/utils/read-feed-posts";

interface Props {
  postId: string;
  viewerId?: string | null;
}

// An expired post reads as not found, the same as a deleted one
export const getPost = async ({
  postId,
  viewerId,
}: Props): Promise<ActionResponse<FeedPost, "POST_NOT_FOUND" | "FAILED_TO_LOAD_POST">> => {
  const { data, error } = await readFeedPosts({
    condition: and(eq(post.id, postId), gt(post.expiresAt, new Date())),
    limit: 1,
    viewerId,
  });

  if (error) {
    return {
      data: null,
      error: { code: "FAILED_TO_LOAD_POST", message: "Couldn't load the post" },
    };
  }

  const [found] = data;

  if (!found) {
    return { data: null, error: { code: "POST_NOT_FOUND", message: "That post is gone" } };
  }

  return { data: found, error: null };
};
