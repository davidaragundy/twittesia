import type { QueryClient } from "@tanstack/react-query";

import type { ToggleCommentReactionInput } from "@/features/comments/types/toggle-comment-reaction-input";
import { updateCachedComment } from "@/features/comments/utils/update-cached-comment";
import { setReaction } from "@/features/posts/utils/set-reaction";

interface Props {
  queryClient: QueryClient;
  postId: string;
  input: ToggleCommentReactionInput;
  isMine: boolean;
}

export const setCachedCommentReaction = ({ queryClient, postId, input, isMine }: Props) =>
  updateCachedComment({
    queryClient,
    postId,
    commentId: input.commentId,
    update: (comment) => ({
      ...comment,
      reactions: setReaction({ reactions: comment.reactions, emoji: input.emoji, isMine }),
    }),
  });
