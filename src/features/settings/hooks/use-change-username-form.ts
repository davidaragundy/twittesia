import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants/rate-limit-error-code";

import { useSession } from "@/features/auth/hooks/use-session";
import { authClient } from "@/features/auth/lib/auth-client";
import type { AuthClientError } from "@/features/auth/types/auth-client-error";
import { getAuthErrorCode } from "@/features/auth/utils/get-auth-error-code";
import { changeUsernameFormSchema } from "@/features/settings/schemas/change-username-form-schema";
import type { ChangeUsernameFormValues } from "@/features/settings/types/change-username-form-values";

export const useChangeUsernameForm = () => {
  const router = useRouter();
  const session = useSession();
  const [isPending, startTransition] = useTransition();

  const form = useForm<ChangeUsernameFormValues>({
    resolver: zodResolver(changeUsernameFormSchema),
    values: {
      username: session?.user.displayUsername ?? "",
    },
  });

  const { isDirty, isValid } = form.formState;
  const username = useWatch({ control: form.control, name: "username" });

  const canSubmit = isDirty && isValid && username?.trim() !== session?.user.displayUsername;

  const handleError = (error: AuthClientError) => {
    if (error.status === RATE_LIMIT_ERROR_CODE) return;

    switch (getAuthErrorCode(error)) {
      case "USERNAME_IS_ALREADY_TAKEN":
        form.setError("username", { message: "Username is already taken. Please try another." });
        return;

      default:
        toast.error("Failed to change username 😢", {
          description: "Please try again later",
          duration: 10_000,
        });
        return;
    }
  };

  const onSubmit = ({ username }: ChangeUsernameFormValues) =>
    startTransition(async () => {
      const { error } = await authClient.updateUser({ username, displayUsername: username });

      if (error) return handleError(error);

      toast.success("Username updated successfully 🎉", { duration: 10_000 });
      form.reset({ username });

      startTransition(() => router.refresh());
    });

  return { form, canSubmit, onSubmit, isPending };
};
