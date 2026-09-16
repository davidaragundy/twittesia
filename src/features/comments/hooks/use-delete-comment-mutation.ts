import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteComment } from "@/features/comments/actions/delete-comment";
import { COMMENTS_QUERY_KEY } from "@/features/comments/constants/comments-query-key";
import type { CommentsData } from "@/features/comments/types/comments-data";
import { changeCachedCommentCount } from "@/features/comments/utils/change-cached-comment-count";
import { removeComment } from "@/features/comments/utils/remove-comment";

interface Props {
  postId: string;
}

export const useDeleteCommentMutation = ({ postId }: Props) => {
  const queryClient = useQueryClient();
  const queryKey = [COMMENTS_QUERY_KEY, postId];

  return useMutation({
    mutationFn: deleteComment,
    // The comment leaves the list at once and comes back if the server refuses
    onMutate: async (commentId: string) => {
      await queryClient.cancelQueries({ queryKey });

      const previous = queryClient.getQueryData<CommentsData>(queryKey);

      queryClient.setQueryData<CommentsData>(queryKey, (comments) =>
        removeComment({ comments, commentId }),
      );
      changeCachedCommentCount({ queryClient, postId, by: -1 });

      return { previous };
    },
    onSuccess: ({ error }, _commentId, context) => {
      if (!error || error.code === "COMMENT_NOT_FOUND") return;

      queryClient.setQueryData(queryKey, context?.previous);
      changeCachedCommentCount({ queryClient, postId, by: 1 });
      toast.error("Couldn't delete your comment", { description: error.message });
    },
    onError: (_error, _commentId, context) => {
      queryClient.setQueryData(queryKey, context?.previous);
      changeCachedCommentCount({ queryClient, postId, by: 1 });
      toast.error("Couldn't delete your comment", { description: "Please try again in a moment." });
    },
  });
};
