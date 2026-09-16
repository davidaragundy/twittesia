import { useInfiniteQuery } from "@tanstack/react-query";

import { useScrollToHash } from "@/shared/hooks/use-scroll-to-hash";

import { COMMENTS_QUERY_KEY } from "@/features/comments/constants/comments-query-key";
import type { CommentsPage } from "@/features/comments/types/comments-page";
import { fetchCommentsPage } from "@/features/comments/utils/fetch-comments-page";

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

  return {
    comments: data.pages.flatMap((page) => page.comments),
    hasNextPage,
    isFetchingNextPage,
    showMore: () => fetchNextPage(),
  };
};
