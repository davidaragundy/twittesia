import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { createComment } from "@/features/comments/actions/create-comment";
import type { CommentFormValues } from "@/features/comments/types/comment-form-values";
import type { CommentsData } from "@/features/comments/types/comments-data";
import { changeCachedCommentCount } from "@/features/comments/utils/change-cached-comment-count";
import { prependComment } from "@/features/comments/utils/prepend-comment";
import { toCommentsQueryPrefix } from "@/features/comments/utils/to-comments-query-prefix";

interface Props {
  postId: string;
  form: UseFormReturn<CommentFormValues>;
}

export const useCreateCommentMutation = ({ postId, form }: Props) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createComment,
    onSuccess: ({ data: created, error }) => {
      if (error) {
        toast.error("Couldn't publish your comment", { description: error.message });
        return;
      }

      // The new comment leads whichever order is on screen, so it is there the moment it is
      // written; where popularity really places it arrives with the next read
      queryClient.setQueriesData<CommentsData>(
        { queryKey: toCommentsQueryPrefix({ postId }) },
        (comments) => prependComment({ comments, comment: created }),
      );
      changeCachedCommentCount({ queryClient, postId, by: 1 });

      form.reset({ content: "" });
    },
    onError: () => {
      toast.error("Couldn't publish your comment", {
        description: "Please try again in a moment.",
      });
    },
  });
};
