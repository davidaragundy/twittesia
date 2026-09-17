import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { restoreQueries } from "@/shared/utils/restore-queries";

import { deleteComment } from "@/features/comments/actions/delete-comment";
import type { CommentsData } from "@/features/comments/types/comments-data";
import { changeCachedCommentCount } from "@/features/comments/utils/change-cached-comment-count";
import { removeComment } from "@/features/comments/utils/remove-comment";
import { toCommentsQueryPrefix } from "@/features/comments/utils/to-comments-query-prefix";

interface Props {
  postId: string;
}

export const useDeleteCommentMutation = ({ postId }: Props) => {
  const queryClient = useQueryClient();
  const queryKey = toCommentsQueryPrefix({ postId });

  return useMutation({
    mutationFn: deleteComment,
    // The comment leaves every order at once and comes back if the server refuses
    onMutate: async (commentId: string) => {
      await queryClient.cancelQueries({ queryKey });

      const previous = queryClient.getQueriesData<CommentsData>({ queryKey });

      queryClient.setQueriesData<CommentsData>({ queryKey }, (comments) =>
        removeComment({ comments, commentId }),
      );
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
