import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { restoreQueries } from "@/shared/utils/restore-queries";

import { deleteComment } from "@/features/comments/actions/delete-comment";
import { COMMENTS_QUERY_KEY } from "@/features/comments/constants/comments-query-key";
import { changeCachedCommentCount } from "@/features/comments/utils/change-cached-comment-count";
import { readCachedComments } from "@/features/comments/utils/read-cached-comments";
import { removeCachedComment } from "@/features/comments/utils/remove-cached-comment";

interface Props {
  postId: string;
}

export const useDeleteCommentMutation = ({ postId }: Props) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteComment,
    // The comment leaves every list at once and comes back if the server refuses
    onMutate: async (commentId: string) => {
      await queryClient.cancelQueries({ queryKey: [COMMENTS_QUERY_KEY] });

      const previous = readCachedComments({ queryClient });

      removeCachedComment({ queryClient, commentId });
      changeCachedCommentCount({ queryClient, postId, by: -1 });

      return { previous };
    },
    onSuccess: ({ error }, _commentId, context) => {
      if (!error || error.code === "COMMENT_NOT_FOUND") return;

      restoreQueries({ queryClient, queries: context?.previous });
      changeCachedCommentCount({ queryClient, postId, by: 1 });
      toast.error("Couldn't delete your comment", { description: error.message });
    },
    onError: (_error, _commentId, context) => {
      restoreQueries({ queryClient, queries: context?.previous });
      changeCachedCommentCount({ queryClient, postId, by: 1 });
      toast.error("Couldn't delete your comment", { description: "Please try again in a moment." });
    },
  });
};
