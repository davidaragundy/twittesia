import "server-only";

import type { ActionResponse } from "@/shared/types/action-response";

import { toPostComment } from "@/features/comments/utils/to-post-comment";
import { SEARCH_PAGE_SIZE } from "@/features/explore/constants/search-page-size";
import type { SearchPage } from "@/features/explore/types/search-page";
import type { SearchResult } from "@/features/explore/types/search-result";
import type { SearchScope } from "@/features/explore/types/search-scope";
import { toSearchType } from "@/features/explore/utils/to-search-type";
import { searchContentPage } from "@/features/posts/utils/search-content-page";
import { toFeedPost } from "@/features/posts/utils/to-feed-post";

interface Props {
  query: string;
  scope: SearchScope;
  offset?: number;
  viewerId?: string | null;
}

// A page of what matches a search, each hit read from its hash and shown as the card it would be
// anywhere else
export const getSearchPage = async ({
  query,
  scope,
  offset = 0,
  viewerId,
}: Props): Promise<ActionResponse<SearchPage, "FAILED_TO_SEARCH">> => {
  if (!query) return { data: { results: [], nextOffset: null }, error: null };

  const { data, error } = await searchContentPage({
    query,
    type: toSearchType({ scope }),
    offset,
    pageSize: SEARCH_PAGE_SIZE,
    viewerId,
  });

  if (error) return { data: null, error: { code: "FAILED_TO_SEARCH", message: "Couldn't search" } };

  return {
    data: {
      results: data.reads.flatMap(({ hash, mine }): SearchResult[] => {
        const post = toFeedPost({ hash, viewerId, mine });

        if (post) return [{ kind: "post", post }];

        const comment = toPostComment({ hash, viewerId, mine });

        if (!comment) return [];

        return [
          {
            kind: "comment",
            comment: { ...comment, postAuthorUsername: hash?.postAuthorHandle || null },
          },
        ];
      }),
      nextOffset: data.nextOffset,
    },
    error: null,
  };
};
