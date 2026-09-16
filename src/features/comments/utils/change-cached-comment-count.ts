import type { QueryClient } from "@tanstack/react-query";

import { updateCachedPost } from "@/features/posts/utils/update-cached-post";

interface Props {
  queryClient: QueryClient;
  postId: string;
  by: number;
}

export const changeCachedCommentCount = ({ queryClient, postId, by }: Props) =>
  updateCachedPost({
    queryClient,
    postId,
    update: (post) => ({ ...post, commentCount: Math.max(post.commentCount + by, 0) }),
  });
