import type { QueryClient } from "@tanstack/react-query";

import { COMMENT_LIST_QUERY_ROOTS } from "@/features/comments/constants/comment-list-query-roots";
import type { CommentsData } from "@/features/comments/types/comments-data";
import { removeComment } from "@/features/comments/utils/remove-comment";

interface Props {
  queryClient: QueryClient;
  commentId: string;
}

// Takes it out of every list the reader has loaded
export const removeCachedComment = ({ queryClient, commentId }: Props) => {
  for (const root of COMMENT_LIST_QUERY_ROOTS) {
    queryClient.setQueriesData<CommentsData>({ queryKey: [root] }, (comments) =>
      removeComment({ comments, commentId }),
    );
  }
};
