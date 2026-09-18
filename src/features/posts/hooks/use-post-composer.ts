import { zodResolver } from "@hookform/resolvers/zod";
import type { KeyboardEvent } from "react";
import { useForm, useWatch } from "react-hook-form";

import { tryCatch } from "@/shared/utils/try-catch";

import { useSession } from "@/features/auth/hooks/use-session";
import { useMediaDrafts } from "@/features/media/hooks/use-media-drafts";
import { useUploadMediaMutation } from "@/features/media/hooks/use-upload-media-mutation";
import { MAX_POST_MEDIA } from "@/features/posts/constants/max-post-media";
import { useCreatePostMutation } from "@/features/posts/hooks/use-create-post-mutation";
import { createPostFormSchema } from "@/features/posts/schemas/create-post-form-schema";
import type { CreatePostFormValues } from "@/features/posts/types/create-post-form-values";

// Suspends until the session resolves: render it below a <Suspense> boundary
export const usePostComposer = () => {
  const session = useSession();

  const form = useForm<CreatePostFormValues>({
    mode: "onChange",
    resolver: zodResolver(createPostFormSchema),
    defaultValues: {
      content: "",
    },
  });

  const { drafts, addFiles, removeDraft, clearDrafts, isFull } = useMediaDrafts({
    max: MAX_POST_MEDIA,
  });
  const { mutateAsync: uploadMedia, isPending: isUploading, progress } = useUploadMediaMutation();
  const { mutate, isPending: isPublishing } = useCreatePostMutation({
    form,
    onPublished: clearDrafts,
  });

  // Read at the top, like every other form hook: a formState read buried in the returned object
  // gets memoized against the stable form, and never sees the field become valid
  const { isValid } = form.formState;

  const content = useWatch({ control: form.control, name: "content" });
  const isPending = isUploading || isPublishing;
  const canSubmit = isValid && (!!content?.trim() || drafts.length > 0) && !isPending;

  // The files go up first, straight to Blob; the post only carries where they landed
  const onSubmit = async (values: CreatePostFormValues) => {
    const { data: media, error } = drafts.length
      ? await tryCatch(uploadMedia(drafts))
      : { data: [], error: null };

    // The upload has already said what went wrong
    if (error) return;

    mutate({ ...values, media });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || !(event.metaKey || event.ctrlKey)) return;

    event.preventDefault();

    if (canSubmit) void form.handleSubmit(onSubmit)();
  };

  return {
    form,
    user: session?.user,
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
