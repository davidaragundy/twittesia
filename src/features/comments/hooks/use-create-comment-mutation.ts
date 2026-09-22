import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { generateId } from "@/shared/utils/generate-id";

import { createComment } from "@/features/comments/actions/create-comment";
import type { CommentFormValues } from "@/features/comments/types/comment-form-values";
import type { CommentsData } from "@/features/comments/types/comments-data";
import type { CreateCommentInput } from "@/features/comments/types/create-comment-input";
import type { PostComment } from "@/features/comments/types/post-comment";
import { changeCachedCommentCount } from "@/features/comments/utils/change-cached-comment-count";
import { prependComment } from "@/features/comments/utils/prepend-comment";
import { removeComment } from "@/features/comments/utils/remove-comment";
import { toCommentsQueryPrefix } from "@/features/comments/utils/to-comments-query-prefix";

interface Props {
  postId: string;
  form: UseFormReturn<CommentFormValues>;
  // Who is writing, so the comment can be shown before the server has it
  author: PostComment["author"];
  // Clears what the form doesn't hold, such as the file attached to it
  onPublished: () => void;
}

/**
 * Publishes a comment the way a post is published: on screen the moment it is written, then
 * swapped for the one the server saved. A comment with files waits for the server instead, since
 * until it answers nothing knows where the files landed.
 */
export const useCreateCommentMutation = ({ postId, form, author, onPublished }: Props) => {
  const queryClient = useQueryClient();
  const queryKey = toCommentsQueryPrefix({ postId });

  const drop = (comments: CommentsData | undefined, pendingId?: string) =>
    pendingId ? removeComment({ comments, commentId: pendingId }) : comments;

  return useMutation({
    mutationFn: createComment,
    onMutate: async (input: CreateCommentInput) => {
      if (input.media?.length) return {};

      await queryClient.cancelQueries({ queryKey });

      const pending: PostComment = {
        id: generateId(),
        postId,
        content: input.content ?? "",
        createdAt: new Date(),
        author,
        isMine: true,
        isPending: true,
        reactions: [],
        media: [],
        viewCount: 0,
      };

      queryClient.setQueriesData<CommentsData>({ queryKey }, (comments) =>
        prependComment({ comments, comment: pending }),
      );
      changeCachedCommentCount({ queryClient, postId, by: 1 });

      form.reset({ content: "" });
      onPublished();

      return { pendingId: pending.id, content: input.content ?? "" };
    },
    onSuccess: ({ data: created, error }, _input, context) => {
      if (error) {
        queryClient.setQueriesData<CommentsData>({ queryKey }, (comments) =>
          drop(comments, context?.pendingId),
        );
        if (context?.pendingId) changeCachedCommentCount({ queryClient, postId, by: -1 });
        form.setValue("content", context?.content ?? form.getValues("content"), {
          shouldValidate: true,
        });
        toast.error("Couldn't publish your comment", { description: error.message });
        return;
      }

      // The comment that was shown is replaced by the one that was saved; it leads whichever
      // order is on screen, and where popularity really places it arrives with the next read
      queryClient.setQueriesData<CommentsData>({ queryKey }, (comments) =>
        prependComment({ comments: drop(comments, context?.pendingId), comment: created }),
      );

      // A comment with files waited for the server, so it is counted and cleared only now
      if (!context?.pendingId) {
        changeCachedCommentCount({ queryClient, postId, by: 1 });
        form.reset({ content: "" });
        onPublished();
      }
    },
    onError: (_error, _input, context) => {
      if (context?.pendingId) {
        queryClient.setQueriesData<CommentsData>({ queryKey }, (comments) =>
          drop(comments, context.pendingId),
        );
        changeCachedCommentCount({ queryClient, postId, by: -1 });
        form.setValue("content", context.content, { shouldValidate: true });
      }

      toast.error("Couldn't publish your comment", {
        description: "Please try again in a moment.",
      });
    },
  });
};
