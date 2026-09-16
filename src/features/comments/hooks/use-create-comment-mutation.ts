import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { createComment } from "@/features/comments/actions/create-comment";
import { COMMENTS_QUERY_KEY } from "@/features/comments/constants/comments-query-key";
import type { CommentFormValues } from "@/features/comments/types/comment-form-values";
import type { CommentsData } from "@/features/comments/types/comments-data";
import { appendComment } from "@/features/comments/utils/append-comment";
import { changeCachedCommentCount } from "@/features/comments/utils/change-cached-comment-count";

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

      queryClient.setQueryData<CommentsData>([COMMENTS_QUERY_KEY, postId], (comments) =>
        appendComment({ comments, comment: created }),
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
