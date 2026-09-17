import type { QueryClient } from "@tanstack/react-query";

import { COMMENT_LIST_QUERY_ROOTS } from "@/features/comments/constants/comment-list-query-roots";
import type { CommentsData } from "@/features/comments/types/comments-data";
import type { PostComment } from "@/features/comments/types/post-comment";

interface Props {
  queryClient: QueryClient;
  commentId: string;
  update: (comment: PostComment) => PostComment;
}

// Every list the reader has loaded, so the comment reads the same wherever they see it next. A
// person's comments carry a field of their own, which the update passes through untouched.
export const updateCachedComment = ({ queryClient, commentId, update }: Props) => {
  for (const root of COMMENT_LIST_QUERY_ROOTS) {
    queryClient.setQueriesData<CommentsData>({ queryKey: [root] }, (comments) =>
      comments
        ? {
            ...comments,
            pages: comments.pages.map((page) => ({
              ...page,
              comments: page.comments.map((item) => (item.id === commentId ? update(item) : item)),
            })),
          }
        : comments,
    );
  }
};
