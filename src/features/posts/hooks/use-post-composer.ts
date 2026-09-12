import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import { MAX_POST_LENGTH } from "@/features/posts/constants/max-post-length";
import { useCreatePostMutation } from "@/features/posts/hooks/use-create-post-mutation";
import { createPostFormSchema } from "@/features/posts/schemas/create-post-form-schema";
import type { CreatePostFormValues } from "@/features/posts/types/create-post-form-values";

export const usePostComposer = () => {
  const form = useForm<CreatePostFormValues>({
    mode: "onChange",
    resolver: zodResolver(createPostFormSchema),
    defaultValues: {
      content: "",
      isGhost: false,
    },
  });

  const { mutate, isPending } = useCreatePostMutation({ form });

  const content = useWatch({ control: form.control, name: "content" });
  const isGhost = useWatch({ control: form.control, name: "isGhost" });

  const onSubmit = (values: CreatePostFormValues) => mutate(values);

  return {
    form,
    onSubmit,
    isPending,
    isGhost,
    remaining: MAX_POST_LENGTH - (content?.length ?? 0),
    canSubmit: form.formState.isValid,
  };
};
