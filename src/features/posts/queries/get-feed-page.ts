import "server-only";

import { and, gt } from "drizzle-orm";

import { post } from "@/shared/lib/drizzle/schema";
import type { ActionResponse } from "@/shared/types/action-response";

import { DEFAULT_FEED_SORT } from "@/features/posts/constants/default-feed-sort";
import { FEED_PAGE_SIZE } from "@/features/posts/constants/feed-page-size";
import type { FeedPage } from "@/features/posts/types/feed-page";
import type { FeedSort } from "@/features/posts/types/feed-sort";
import { feedCursorCondition } from "@/features/posts/utils/feed-cursor-condition";
import { parseFeedCursor } from "@/features/posts/utils/parse-feed-cursor";
import { readFeedPosts } from "@/features/posts/utils/read-feed-posts";
import { toFeedCursor } from "@/features/posts/utils/to-feed-cursor";

interface Props {
  cursor?: string | null;
  sort?: FeedSort;
  viewerId?: string | null;
}

// Expiry is applied here rather than trusted to the purge, so a post is never read past its
// lifespan, whenever the expired rows are actually deleted
export const getFeedPage = async ({
  cursor,
  sort = DEFAULT_FEED_SORT,
  viewerId,
}: Props): Promise<ActionResponse<FeedPage, "FAILED_TO_LOAD_FEED">> => {
  const after = parseFeedCursor({ cursor, sort });

  const { data, error } = await readFeedPosts({
    condition: and(gt(post.expiresAt, new Date()), feedCursorCondition({ after, sort })),
    // One more than the page, to tell whether another page follows
    limit: FEED_PAGE_SIZE + 1,
    sort,
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
      nextCursor: data.length > FEED_PAGE_SIZE && last ? toFeedCursor({ post: last, sort }) : null,
    },
    error: null,
  };
};
