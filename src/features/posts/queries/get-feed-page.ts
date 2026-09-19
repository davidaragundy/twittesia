import "server-only";

import type { ActionResponse } from "@/shared/types/action-response";
import { tryCatch } from "@/shared/utils/try-catch";

import { DEFAULT_FEED_SORT } from "@/features/posts/constants/default-feed-sort";
import { FEED_PAGE_SIZE } from "@/features/posts/constants/feed-page-size";
import type { FeedPage } from "@/features/posts/types/feed-page";
import type { FeedPost } from "@/features/posts/types/feed-post";
import type { FeedSort } from "@/features/posts/types/feed-sort";
import { getContentIndex } from "@/features/posts/utils/get-content-index";
import { parseFeedCursor } from "@/features/posts/utils/parse-feed-cursor";
import { readPostHashes } from "@/features/posts/utils/read-post-hashes";
import { toFeedPost } from "@/features/posts/utils/to-feed-post";

interface Props {
  cursor?: string | null;
  sort?: FeedSort;
  // An identity, when the page being read is one person's posts rather than everyone's
  authorId?: string | null;
  viewerId?: string | null;
}

/**
 * One search query finds and orders a page of keys; one pipelined read fetches their hashes.
 *
 * The page's end and its cursor come from the search results, not from the posts read: the index
 * can still list a post deleted or expired a moment ago, whose hash reads as nothing, and a page
 * with a gap in it is still not the last page. Expiry is part of the filter for the same reason.
 */
export const getFeedPage = async ({
  cursor,
  sort = DEFAULT_FEED_SORT,
  authorId,
  viewerId,
}: Props): Promise<ActionResponse<FeedPage, "FAILED_TO_LOAD_FEED">> => {
  const failure = {
    data: null,
    error: { code: "FAILED_TO_LOAD_FEED" as const, message: "Couldn't load the feed" },
  };

  const after = parseFeedCursor({ cursor });
  const field = sort === "popular" ? "rank" : "createdAt";

  const { data: results, error } = await tryCatch(
    getContentIndex().query({
      filter: {
        type: "post",
        expiresAt: { $gt: Date.now() },
        ...(authorId ? { authorId } : {}),
        ...(after ? { [field]: { $lt: after } } : {}),
      },
      orderBy: sort === "popular" ? { rank: "DESC" } : { createdAt: "DESC" },
      // Only the field the order sorts on: a number, which the index returns exactly
      select: sort === "popular" ? { rank: true } : { createdAt: true },
      // One more than the page, to tell whether another page follows
      limit: FEED_PAGE_SIZE + 1,
    }),
  );

  if (error) return failure;

  const page = results.slice(0, FEED_PAGE_SIZE);
  const last = page.at(-1);

  const { data: hashes, error: readError } = await tryCatch(
    readPostHashes({ keys: page.map((result) => result.key), viewerId }),
  );

  if (readError) return failure;

  return {
    data: {
      posts: hashes
        .map(({ hash, mine }) => toFeedPost({ hash, viewerId, mine }))
        .filter((post): post is FeedPost => post !== null),
      nextCursor:
        results.length > FEED_PAGE_SIZE && last
          ? String((last.data as Record<string, unknown>)[field])
          : null,
    },
    error: null,
  };
};
