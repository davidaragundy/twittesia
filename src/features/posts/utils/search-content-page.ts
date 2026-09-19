import "server-only";

import type { ActionResponse } from "@/shared/types/action-response";
import { tryCatch } from "@/shared/utils/try-catch";

import type { ContentType } from "@/features/posts/types/content-type";
import { getContentIndex } from "@/features/posts/utils/get-content-index";
import { readContentHashes } from "@/features/posts/utils/read-content-hashes";

interface Props {
  // What the reader typed, matched against the text of posts and comments
  query: string;
  // Narrows to one kind, where a search is for posts or comments alone
  type?: ContentType | null;
  // How many results to skip, since relevance has no cursor to page by
  offset: number;
  pageSize: number;
  viewerId?: string | null;
}

/**
 * A page of posts and comments matching a search, most relevant first.
 *
 * The index's smart matching ranks exact phrases above scattered words, those above typos, and
 * forgives an unfinished last word, so it works as someone types. A query in double quotes is
 * matched as that exact phrase.
 *
 * Relevance is a score rather than a field, so pages are counted off rather than followed by
 * cursor. As with every other read, the index only finds and orders the keys; the text comes
 * from the hashes, exactly as it was written.
 */
export const searchContentPage = async ({
  query,
  type,
  offset,
  pageSize,
  viewerId,
}: Props): Promise<
  ActionResponse<
    { reads: Awaited<ReturnType<typeof readContentHashes>>; nextOffset: number | null },
    "FAILED_TO_SEARCH_CONTENT"
  >
> => {
  const failure = {
    data: null,
    error: { code: "FAILED_TO_SEARCH_CONTENT" as const, message: "Couldn't search" },
  };

  const { data: results, error } = await tryCatch(
    getContentIndex().query({
      filter: { ...(type ? { type } : {}), content: query, expiresAt: { $gt: Date.now() } },
      select: {},
      // One more than the page, to tell whether another page follows
      limit: pageSize + 1,
      offset,
    }),
  );

  if (error) return failure;

  const page = results.slice(0, pageSize);

  const { data: reads, error: readError } = await tryCatch(
    readContentHashes({ keys: page.map((result) => result.key), viewerId }),
  );

  if (readError) return failure;

  return {
    data: { reads, nextOffset: results.length > pageSize ? offset + pageSize : null },
    error: null,
  };
};
