import "server-only";

import type { ActionResponse } from "@/shared/types/action-response";

import { DEFAULT_FEED_SORT } from "@/features/posts/constants/default-feed-sort";
import { FEED_PAGE_SIZE } from "@/features/posts/constants/feed-page-size";
import type { FeedPage } from "@/features/posts/types/feed-page";
import type { FeedPost } from "@/features/posts/types/feed-post";
import type { FeedSort } from "@/features/posts/types/feed-sort";
import { queryContentPage } from "@/features/posts/utils/query-content-page";
import { toFeedPost } from "@/features/posts/utils/to-feed-post";

interface Props {
  cursor?: string | null;
  sort?: FeedSort;
  // An identity, when the page being read is one person's posts rather than everyone's
  authorId?: string | null;
  viewerId?: string | null;
}

export const getFeedPage = async ({
  cursor,
  sort = DEFAULT_FEED_SORT,
  authorId,
  viewerId,
}: Props): Promise<ActionResponse<FeedPage, "FAILED_TO_LOAD_FEED">> => {
  const { data, error } = await queryContentPage({
    filter: { type: "post", ...(authorId ? { authorId } : {}) },
    sort,
    cursor,
    pageSize: FEED_PAGE_SIZE,
    viewerId,
  });

  if (error) {
    return {
      data: null,
      error: { code: "FAILED_TO_LOAD_FEED", message: "Couldn't load the feed" },
    };
  }

  return {
    data: {
      posts: data.reads
        .map(({ hash, mine }) => toFeedPost({ hash, viewerId, mine }))
        .filter((post): post is FeedPost => post !== null),
      nextCursor: data.nextCursor,
    },
    error: null,
  };
};
