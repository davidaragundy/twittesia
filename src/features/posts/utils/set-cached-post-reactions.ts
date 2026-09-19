import type { QueryClient } from "@tanstack/react-query";

import { mergeReactions } from "@/features/posts/utils/merge-reactions";
import { updateCachedPost } from "@/features/posts/utils/update-cached-post";

interface Props {
  queryClient: QueryClient;
  postId: string;
  counts: { emoji: string; count: number }[];
}

// What an event says a post's reactions are now, wherever the reader has it on screen
export const setCachedPostReactions = ({ queryClient, postId, counts }: Props) =>
  updateCachedPost({
    queryClient,
    postId,
    update: (post) => ({ ...post, reactions: mergeReactions({ current: post.reactions, counts }) }),
  });
