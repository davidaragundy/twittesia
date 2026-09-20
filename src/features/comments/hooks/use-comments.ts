import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

import { useScrollToHash } from "@/shared/hooks/use-scroll-to-hash";

import { COMMENT_VIEWS_URL } from "@/features/comments/constants/comment-views-url";
import { DEFAULT_COMMENT_SORT } from "@/features/comments/constants/default-comment-sort";
import { useCommentEvents } from "@/features/comments/hooks/use-comment-events";
import type { CommentSort } from "@/features/comments/types/comment-sort";
import type { CommentsPage } from "@/features/comments/types/comments-page";
import { fetchCommentsPage } from "@/features/comments/utils/fetch-comments-page";
import { toCommentsQueryKey } from "@/features/comments/utils/to-comments-query-key";
import { useViewTracking } from "@/features/posts/hooks/use-view-tracking";

interface Props {
  postId: string;
  // The reader, so their own comments never arrive as news
  viewerId?: string | null;
  // Rendered on the server, so the first comments are there on the first paint
  initialPage: CommentsPage;
}

export const useComments = ({ postId, initialPage, viewerId }: Props) => {
  useScrollToHash({ id: "comments" });
  useCommentEvents({ postId, viewerId });

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

  // Loads the next page once the end of the list comes into view, as the feed does
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const end = endRef.current;

    if (!end || !hasNextPage) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) fetchNextPage();
    });

    observer.observe(end);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

  const comments = data?.pages.flatMap((page) => page.comments) ?? [];
  const { containerRef } = useViewTracking({
    ids: comments.map((comment) => comment.id),
    url: COMMENT_VIEWS_URL,
  });

  return {
    comments,
    containerRef,
    endRef,
    sort,
    setSort,
    isPending,
    hasNextPage,
    isFetchingNextPage,
  };
};
