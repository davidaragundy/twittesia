import type { QueryClient } from "@tanstack/react-query";

import type { CommentsData } from "@/features/comments/types/comments-data";
import type { PostComment } from "@/features/comments/types/post-comment";
import { toCommentsQueryPrefix } from "@/features/comments/utils/to-comments-query-prefix";

interface Props {
  queryClient: QueryClient;
  postId: string;
  commentId: string;
  update: (comment: PostComment) => PostComment;
}

// Every order the reader has loaded, so the comment reads the same whichever one they switch to
export const updateCachedComment = ({ queryClient, postId, commentId, update }: Props) =>
  queryClient.setQueriesData<CommentsData>(
    { queryKey: toCommentsQueryPrefix({ postId }) },
    (comments) =>
      comments && {
        ...comments,
        pages: comments.pages.map((page) => ({
          ...page,
          comments: page.comments.map((item) => (item.id === commentId ? update(item) : item)),
        })),
      },
  );
