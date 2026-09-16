import type { QueryClient } from "@tanstack/react-query";

import { COMMENTS_QUERY_KEY } from "@/features/comments/constants/comments-query-key";
import type { CommentsData } from "@/features/comments/types/comments-data";
import type { PostComment } from "@/features/comments/types/post-comment";

interface Props {
  queryClient: QueryClient;
  postId: string;
  commentId: string;
}

export const findCachedComment = ({
  queryClient,
  postId,
  commentId,
}: Props): PostComment | undefined =>
  queryClient
    .getQueryData<CommentsData>([COMMENTS_QUERY_KEY, postId])
    ?.pages.flatMap((page) => page.comments)
    .find((item) => item.id === commentId);
