import type { QueryClient } from "@tanstack/react-query";

import { updateCachedPost } from "@/features/posts/utils/update-cached-post";

interface Props {
  queryClient: QueryClient;
  postId: string;
  commentCount: number;
}

// What an event says a post's comment count is now, rather than a step up or down from it
export const setCachedCommentCount = ({ queryClient, postId, commentCount }: Props) =>
  updateCachedPost({
    queryClient,
    postId,
    update: (post) => ({ ...post, commentCount: Math.max(commentCount, 0) }),
  });
