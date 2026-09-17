import type { QueryClient } from "@tanstack/react-query";

import type { CommentsData } from "@/features/comments/types/comments-data";
import type { PostComment } from "@/features/comments/types/post-comment";
import { toCommentsQueryPrefix } from "@/features/comments/utils/to-comments-query-prefix";

interface Props {
  queryClient: QueryClient;
  postId: string;
  commentId: string;
}

// Whichever order of the post's comments holds it
export const findCachedComment = ({
  queryClient,
  postId,
  commentId,
}: Props): PostComment | undefined =>
  queryClient
    .getQueriesData<CommentsData>({ queryKey: toCommentsQueryPrefix({ postId }) })
    .map(([, comments]) =>
      comments?.pages.flatMap((page) => page.comments).find((item) => item.id === commentId),
    )
    .find(Boolean);
