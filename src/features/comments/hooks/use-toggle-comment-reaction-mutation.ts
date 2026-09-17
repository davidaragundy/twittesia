import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { toggleCommentReaction } from "@/features/comments/actions/toggle-comment-reaction";
import { COMMENTS_QUERY_KEY } from "@/features/comments/constants/comments-query-key";
import type { ToggleCommentReactionInput } from "@/features/comments/types/toggle-comment-reaction-input";
import { changeCachedCommentCount } from "@/features/comments/utils/change-cached-comment-count";
import { findCachedComment } from "@/features/comments/utils/find-cached-comment";
import { removeCachedComment } from "@/features/comments/utils/remove-cached-comment";
import { setCachedCommentReaction } from "@/features/comments/utils/set-cached-comment-reaction";

interface Props {
  postId: string;
}

export const useToggleCommentReactionMutation = ({ postId }: Props) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleCommentReaction,
    // Writes a state rather than restoring a snapshot, so toggles queued behind each other can't
    // overwrite one another's result
    onMutate: async (input: ToggleCommentReactionInput) => {
      await queryClient.cancelQueries({ queryKey: [COMMENTS_QUERY_KEY] });

      const comment = findCachedComment({ queryClient, commentId: input.commentId });
      const isAdding = !comment?.reactions.some(
        (item) => item.emoji === input.emoji && item.isMine,
      );

      setCachedCommentReaction({ queryClient, input, isMine: isAdding });

      return { isAdding };
    },
    onSuccess: ({ data, error }, input, context) => {
      // A comment that has been deleted, or whose post expired, leaves the list
      if (error?.code === "COMMENT_NOT_FOUND") {
        removeCachedComment({ queryClient, commentId: input.commentId });
        changeCachedCommentCount({ queryClient, postId, by: -1 });
        toast.error("Couldn't save your reaction", { description: error.message });
        return;
      }

      if (error) {
        setCachedCommentReaction({ queryClient, input, isMine: !context.isAdding });
        toast.error("Couldn't save your reaction", { description: error.message });
        return;
      }

      // The server toggled what it had, which differs only when this cache was out of date
      if (data.reacted !== context.isAdding) {
        setCachedCommentReaction({ queryClient, input, isMine: data.reacted });
      }
    },
    onError: (_error, input, context) => {
      if (context) {
        setCachedCommentReaction({ queryClient, input, isMine: !context.isAdding });
      }
      toast.error("Couldn't save your reaction", { description: "Please try again in a moment." });
    },
  });
};
