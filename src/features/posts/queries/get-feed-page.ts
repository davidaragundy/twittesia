import "server-only";

import { and, gt, lt, sql } from "drizzle-orm";

import { post } from "@/shared/lib/drizzle/schema";
import type { ActionResponse } from "@/shared/types/action-response";

import { FEED_PAGE_SIZE } from "@/features/posts/constants/feed-page-size";
import type { FeedPage } from "@/features/posts/types/feed-page";
import { parseFeedCursor, toFeedCursor } from "@/features/posts/utils/feed-cursor";
import { readFeedPosts } from "@/features/posts/utils/read-feed-posts";

interface Props {
  cursor?: string | null;
  viewerId?: string | null;
}

// Expiry is applied here rather than trusted to the purge, so a post is never read past its
// lifespan, whenever the expired rows are actually deleted
export const getFeedPage = async ({
  cursor,
  viewerId,
}: Props): Promise<ActionResponse<FeedPage, "FAILED_TO_LOAD_FEED">> => {
  const after = parseFeedCursor(cursor);

  const { data, error } = await readFeedPosts({
    condition: and(
      gt(post.expiresAt, new Date()),
      after
        ? lt(sql`(${post.createdAt}, ${post.id})`, sql`(${after.createdAt}, ${after.id})`)
        : undefined,
    ),
    // One more than the page, to tell whether another page follows
    limit: FEED_PAGE_SIZE + 1,
    viewerId,
  });

  if (error) {
    return {
      data: null,
      error: { code: "FAILED_TO_LOAD_FEED", message: "Couldn't load the feed" },
    };
  }

  const posts = data.slice(0, FEED_PAGE_SIZE);
  const last = posts.at(-1);

  return {
    data: {
      posts,
      nextCursor: data.length > FEED_PAGE_SIZE && last ? toFeedCursor(last) : null,
    },
    error: null,
  };
};
