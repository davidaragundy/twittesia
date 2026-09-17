import { useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";

import { COMMENT_VIEWS_URL } from "@/features/comments/constants/comment-views-url";
import { DEFAULT_COMMENT_SORT } from "@/features/comments/constants/default-comment-sort";
import type { CommentSort } from "@/features/comments/types/comment-sort";
import type { ProfileCommentsPage } from "@/features/comments/types/profile-comments-page";
import { fetchProfileCommentsPage } from "@/features/comments/utils/fetch-profile-comments-page";
import { toProfileCommentsQueryKey } from "@/features/comments/utils/to-profile-comments-query-key";
import { useViewTracking } from "@/features/posts/hooks/use-view-tracking";

interface Props {
  username: string;
  // Rendered on the server, so the first comments are there on the first paint
  initialPage: ProfileCommentsPage;
}

export const useProfileComments = ({ username, initialPage }: Props) => {
  const [sort, setSort] = useState<CommentSort>(DEFAULT_COMMENT_SORT);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } = useInfiniteQuery({
    queryKey: toProfileCommentsQueryKey({ username, sort }),
    queryFn: ({ pageParam }) => fetchProfileCommentsPage({ username, cursor: pageParam, sort }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage: ProfileCommentsPage) => lastPage.nextCursor,
    // Only the order the server rendered starts with a page; another is read when it is asked for
    initialData:
      sort === DEFAULT_COMMENT_SORT ? { pages: [initialPage], pageParams: [null] } : undefined,
  });

  const comments = data?.pages.flatMap((page) => page.comments) ?? [];
  const { containerRef } = useViewTracking({
    ids: comments.map((comment) => comment.id),
    url: COMMENT_VIEWS_URL,
  });

  return {
    comments,
    containerRef,
    sort,
    setSort,
    isPending,
    hasNextPage,
    isFetchingNextPage,
    showMore: () => fetchNextPage(),
  };
};
