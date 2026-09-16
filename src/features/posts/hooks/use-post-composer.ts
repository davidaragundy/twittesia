import { zodResolver } from "@hookform/resolvers/zod";
import type { KeyboardEvent } from "react";
import { useForm, useWatch } from "react-hook-form";

import { useSession } from "@/features/auth/hooks/use-session";
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

  const { mutate, isPending } = useCreatePostMutation({ form });

  // Read at the top, like every other form hook: a formState read buried in the returned object
  // gets memoized against the stable form, and never sees the field become valid
  const { isValid } = form.formState;

  const content = useWatch({ control: form.control, name: "content" });

  const onSubmit = (values: CreatePostFormValues) => mutate(values);

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || !(event.metaKey || event.ctrlKey)) return;

    event.preventDefault();

    if (isValid && !isPending) void form.handleSubmit(onSubmit)();
  };

  return {
    form,
    user: session?.user,
    onSubmit,
    onKeyDown,
    isPending,
    length: content?.length ?? 0,
    canSubmit: isValid && !isPending,
  };
};
