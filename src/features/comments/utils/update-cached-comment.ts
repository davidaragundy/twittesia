import type { QueryClient } from "@tanstack/react-query";

import { COMMENTS_QUERY_KEY } from "@/features/comments/constants/comments-query-key";
import type { CommentsData } from "@/features/comments/types/comments-data";
import type { PostComment } from "@/features/comments/types/post-comment";

interface Props {
  queryClient: QueryClient;
  postId: string;
  commentId: string;
  update: (comment: PostComment) => PostComment;
}

export const updateCachedComment = ({ queryClient, postId, commentId, update }: Props) =>
  queryClient.setQueryData<CommentsData>(
    [COMMENTS_QUERY_KEY, postId],
    (comments) =>
      comments && {
        ...comments,
        pages: comments.pages.map((page) => ({
          ...page,
          comments: page.comments.map((item) => (item.id === commentId ? update(item) : item)),
        })),
      },
  );
