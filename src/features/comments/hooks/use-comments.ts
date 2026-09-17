import { useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";

import { useScrollToHash } from "@/shared/hooks/use-scroll-to-hash";

import { COMMENT_VIEWS_URL } from "@/features/comments/constants/comment-views-url";
import { DEFAULT_COMMENT_SORT } from "@/features/comments/constants/default-comment-sort";
import type { CommentSort } from "@/features/comments/types/comment-sort";
import type { CommentsPage } from "@/features/comments/types/comments-page";
import { fetchCommentsPage } from "@/features/comments/utils/fetch-comments-page";
import { toCommentsQueryKey } from "@/features/comments/utils/to-comments-query-key";
import { useViewTracking } from "@/features/posts/hooks/use-view-tracking";

interface Props {
  postId: string;
  // Rendered on the server, so the first comments are there on the first paint
  initialPage: CommentsPage;
}

export const useComments = ({ postId, initialPage }: Props) => {
  useScrollToHash({ id: "comments" });

  const [sort, setSort] = useState<CommentSort>(DEFAULT_COMMENT_SORT);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } = useInfiniteQuery({
    queryKey: toCommentsQueryKey({ postId, sort }),
    queryFn: ({ pageParam }) => fetchCommentsPage({ postId, cursor: pageParam, sort }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage: CommentsPage) => lastPage.nextCursor,
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
