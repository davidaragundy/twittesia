import { zodResolver } from "@hookform/resolvers/zod";
import type { KeyboardEvent } from "react";
import { useForm, useWatch } from "react-hook-form";

import { useCreateCommentMutation } from "@/features/comments/hooks/use-create-comment-mutation";
import { commentFormSchema } from "@/features/comments/schemas/comment-form-schema";
import type { CommentFormValues } from "@/features/comments/types/comment-form-values";

interface Props {
  postId: string;
}

export const useCommentComposer = ({ postId }: Props) => {
  const form = useForm<CommentFormValues>({
    mode: "onChange",
    resolver: zodResolver(commentFormSchema),
    defaultValues: { content: "" },
  });

  const { mutate, isPending } = useCreateCommentMutation({ postId, form });

  // Read at the top, like every other form hook: a formState read buried in the returned object
  // gets memoized against the stable form, and never sees the field become valid
  const { isValid } = form.formState;

  const content = useWatch({ control: form.control, name: "content" });

  const onSubmit = ({ content: text }: CommentFormValues) => mutate({ postId, content: text });

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || !(event.metaKey || event.ctrlKey)) return;

    event.preventDefault();

    if (isValid && !isPending) void form.handleSubmit(onSubmit)();
  };

  return {
    form,
    onSubmit,
    onKeyDown,
    isPending,
    length: content?.length ?? 0,
    canSubmit: isValid && !isPending,
  };
};
