import "server-only";

import type { ActionResponse } from "@/shared/types/action-response";
import { tryCatch } from "@/shared/utils/try-catch";

import { CONTENT_KEYS_PAGE_SIZE } from "@/features/posts/constants/content-keys-page-size";
import type { ContentFilter } from "@/features/posts/types/content-filter";
import { getContentIndex } from "@/features/posts/utils/get-content-index";

interface Props {
  filter: ContentFilter;
}

/**
 * Every key of the posts and comments that match, however many: page after page in creation
 * order, oldest first, until a page comes back short. Nothing is read or changed while paging,
 * so the order holds still underneath it.
 */
export const queryContentKeys = async ({
  filter,
}: Props): Promise<ActionResponse<string[], "FAILED_TO_QUERY_CONTENT">> => {
  const keys: string[] = [];

  for (;;) {
    const { data: results, error } = await tryCatch(
      getContentIndex().query({
        filter,
        orderBy: { createdAt: "ASC" },
        select: {},
        limit: CONTENT_KEYS_PAGE_SIZE,
        offset: keys.length,
      }),
    );

    if (error) {
      return {
        data: null,
        error: { code: "FAILED_TO_QUERY_CONTENT", message: "Couldn't load this" },
      };
    }

    keys.push(...results.map((result) => result.key));

    if (results.length < CONTENT_KEYS_PAGE_SIZE) return { data: keys, error: null };
  }
};
