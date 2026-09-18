import { zodResolver } from "@hookform/resolvers/zod";
import type { KeyboardEvent } from "react";
import { useForm, useWatch } from "react-hook-form";

import { tryCatch } from "@/shared/utils/try-catch";

import { MAX_COMMENT_MEDIA } from "@/features/comments/constants/max-comment-media";
import { useCreateCommentMutation } from "@/features/comments/hooks/use-create-comment-mutation";
import { commentFormSchema } from "@/features/comments/schemas/comment-form-schema";
import type { CommentFormValues } from "@/features/comments/types/comment-form-values";
import { useMediaDrafts } from "@/features/media/hooks/use-media-drafts";
import { useUploadMediaMutation } from "@/features/media/hooks/use-upload-media-mutation";

interface Props {
  postId: string;
}

export const useCommentComposer = ({ postId }: Props) => {
  const form = useForm<CommentFormValues>({
    mode: "onChange",
    resolver: zodResolver(commentFormSchema),
    defaultValues: { content: "" },
  });

  const { drafts, addFiles, removeDraft, clearDrafts, isFull } = useMediaDrafts({
    max: MAX_COMMENT_MEDIA,
  });
  const { mutateAsync: uploadMedia, isPending: isUploading, progress } = useUploadMediaMutation();
  const { mutate, isPending: isPublishing } = useCreateCommentMutation({
    postId,
    form,
    onPublished: clearDrafts,
  });

  // Read at the top, like every other form hook: a formState read buried in the returned object
  // gets memoized against the stable form, and never sees the field become valid
  const { isValid } = form.formState;

  const content = useWatch({ control: form.control, name: "content" });
  const isPending = isUploading || isPublishing;
  const canSubmit = isValid && (!!content?.trim() || drafts.length > 0) && !isPending;

  // The file goes up first, straight to Blob; the comment only carries where it landed
  const onSubmit = async ({ content: text }: CommentFormValues) => {
    const { data: media, error } = drafts.length
      ? await tryCatch(uploadMedia(drafts))
      : { data: [], error: null };

    // The upload has already said what went wrong
    if (error) return;

    mutate({ postId, content: text, media });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || !(event.metaKey || event.ctrlKey)) return;

    event.preventDefault();

    if (canSubmit) void form.handleSubmit(onSubmit)();
  };

  return {
    form,
    onSubmit,
    onKeyDown,
    isPending,
    isUploading,
    length: content?.length ?? 0,
    canSubmit,
    drafts,
    progress,
    addFiles,
    removeDraft,
    canAttach: !isFull && !isPending,
  };
};
