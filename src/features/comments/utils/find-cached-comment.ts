import type { QueryClient } from "@tanstack/react-query";

import { COMMENT_LIST_QUERY_ROOTS } from "@/features/comments/constants/comment-list-query-roots";
import type { CommentsData } from "@/features/comments/types/comments-data";
import type { PostComment } from "@/features/comments/types/post-comment";

interface Props {
  queryClient: QueryClient;
  commentId: string;
}

// Whichever list the reader has loaded holds it
export const findCachedComment = ({ queryClient, commentId }: Props): PostComment | undefined =>
  COMMENT_LIST_QUERY_ROOTS.flatMap((root) =>
    queryClient.getQueriesData<CommentsData>({ queryKey: [root] }),
  )
    .map(([, comments]) =>
      comments?.pages.flatMap((page) => page.comments).find((item) => item.id === commentId),
    )
    .find(Boolean);
