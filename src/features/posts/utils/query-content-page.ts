import "server-only";

import type { ActionResponse } from "@/shared/types/action-response";
import { tryCatch } from "@/shared/utils/try-catch";

import type { ContentSort } from "@/features/posts/types/content-sort";
import { getContentIndex } from "@/features/posts/utils/get-content-index";
import { parseFeedCursor } from "@/features/posts/utils/parse-feed-cursor";
import { readContentHashes } from "@/features/posts/utils/read-content-hashes";

interface Props {
  // Which posts or comments: exact matches on the index's keyword fields
  filter: Record<string, string>;
  sort: ContentSort;
  cursor?: string | null;
  pageSize: number;
  viewerId?: string | null;
}

/**
 * A page of posts or comments: one search query finds and orders the keys, one pipelined read
 * fetches their hashes and the reader's own reactions.
 *
 * The page's end and its cursor come from the search results, not from what was read: the index
 * can still list something deleted or expired a moment ago, whose hash reads as nothing, and a
 * page with a gap in it is still not the last page. Expiry is part of the filter for the same
 * reason.
 */
export const queryContentPage = async ({
  filter,
  sort,
  cursor,
  pageSize,
  viewerId,
}: Props): Promise<
  ActionResponse<
    {
      reads: Awaited<ReturnType<typeof readContentHashes>>;
      nextCursor: string | null;
    },
    "FAILED_TO_QUERY_CONTENT"
  >
> => {
  const failure = {
    data: null,
    error: { code: "FAILED_TO_QUERY_CONTENT" as const, message: "Couldn't load this" },
  };

  const after = parseFeedCursor({ cursor });
  const field = sort === "popular" ? "rank" : "createdAt";

  const { data: results, error } = await tryCatch(
    getContentIndex().query({
      filter: {
        ...filter,
        expiresAt: { $gt: Date.now() },
        ...(after ? { [field]: { $lt: after } } : {}),
      },
      orderBy: sort === "popular" ? { rank: "DESC" } : { createdAt: "DESC" },
      // Only the field the order sorts on: a number, which the index returns exactly
      select: sort === "popular" ? { rank: true } : { createdAt: true },
      // One more than the page, to tell whether another page follows
      limit: pageSize + 1,
    }),
  );

  if (error) return failure;

  const page = results.slice(0, pageSize);
  const last = page.at(-1);

  const { data: reads, error: readError } = await tryCatch(
    readContentHashes({ keys: page.map((result) => result.key), viewerId }),
  );

  if (readError) return failure;

  return {
    data: {
      reads,
      nextCursor:
        results.length > pageSize && last
          ? String((last.data as Record<string, unknown>)[field])
          : null,
    },
    error: null,
  };
};
