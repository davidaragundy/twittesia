import type { QueryClient } from "@tanstack/react-query";

import { updateCachedComment } from "@/features/comments/utils/update-cached-comment";
import { mergeReactions } from "@/features/posts/utils/merge-reactions";

interface Props {
  queryClient: QueryClient;
  commentId: string;
  counts: { emoji: string; count: number }[];
}

// What an event says a comment's reactions are now, in every list the reader has loaded
export const setCachedCommentReactions = ({ queryClient, commentId, counts }: Props) =>
  updateCachedComment({
    queryClient,
    commentId,
    update: (comment) => ({
      ...comment,
      reactions: mergeReactions({ current: comment.reactions, counts }),
    }),
  });
