import { useInfiniteQuery } from "@tanstack/react-query";

import { useScrollToHash } from "@/shared/hooks/use-scroll-to-hash";

import { COMMENT_VIEWS_URL } from "@/features/comments/constants/comment-views-url";
import { COMMENTS_QUERY_KEY } from "@/features/comments/constants/comments-query-key";
import type { CommentsPage } from "@/features/comments/types/comments-page";
import { fetchCommentsPage } from "@/features/comments/utils/fetch-comments-page";
import { useViewTracking } from "@/features/posts/hooks/use-view-tracking";

interface Props {
  postId: string;
  // Rendered on the server, so the first comments are there on the first paint
  initialPage: CommentsPage;
}

export const useComments = ({ postId, initialPage }: Props) => {
  useScrollToHash({ id: "comments" });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: [COMMENTS_QUERY_KEY, postId],
    queryFn: ({ pageParam }) => fetchCommentsPage({ postId, cursor: pageParam }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage: CommentsPage) => lastPage.nextCursor,
    initialData: { pages: [initialPage], pageParams: [null] },
  });

  const comments = data.pages.flatMap((page) => page.comments);
  const { containerRef } = useViewTracking({
    ids: comments.map((comment) => comment.id),
    url: COMMENT_VIEWS_URL,
  });

  return {
    comments,
    containerRef,
    hasNextPage,
    isFetchingNextPage,
    showMore: () => fetchNextPage(),
  };
};
