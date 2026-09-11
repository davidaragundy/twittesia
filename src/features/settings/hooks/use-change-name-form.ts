import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants/rate-limit-error-code";

import { useSession } from "@/features/auth/hooks/use-session";
import { authClient } from "@/features/auth/lib/auth-client";
import type { AuthClientError } from "@/features/auth/types/auth-client-error";
import { changeNameFormSchema } from "@/features/settings/schemas/change-name-form-schema";
import type { ChangeNameFormValues } from "@/features/settings/types/change-name-form-values";

export const useChangeNameForm = () => {
  const router = useRouter();
  const session = useSession();
  const [isPending, startTransition] = useTransition();

  const form = useForm<ChangeNameFormValues>({
    resolver: zodResolver(changeNameFormSchema),
    values: {
      name: session?.user.name ?? "",
    },
  });

  const { isDirty, isValid } = form.formState;
  const name = useWatch({ control: form.control, name: "name" });

  const canSubmit = isDirty && isValid && name?.trim() !== session?.user.name;

  const handleError = (error: AuthClientError) => {
    if (error.status === RATE_LIMIT_ERROR_CODE) return;

    toast.error("Something went wrong 😢", {
      description: "Please try again later",
      duration: 10_000,
    });
  };

  const onSubmit = ({ name }: ChangeNameFormValues) =>
    startTransition(async () => {
      const { error } = await authClient.updateUser({ name });

      if (error) return handleError(error);

      toast.success("Name updated successfully 🎉", { duration: 10_000 });
      form.reset({ name });

      // Re-renders the server parts with the new name, inside this transition
      startTransition(() => router.refresh());
    });

  return { form, canSubmit, onSubmit, isPending };
};
