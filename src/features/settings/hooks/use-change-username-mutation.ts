import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants";
import { authClient } from "@/shared/lib/better-auth/client";

import type { AuthClientError } from "@/features/auth/types";
import type { ChangeUsernameFormValues } from "@/features/settings/types";

interface Props {
  form: UseFormReturn<ChangeUsernameFormValues>;
}

export const useChangeUsernameMutation = ({ form }: Props) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleError = (error: AuthClientError) => {
    if (error.status === RATE_LIMIT_ERROR_CODE) return;

    switch (error.code) {
      case "USERNAME_IS_ALREADY_TAKEN_PLEASE_TRY_ANOTHER":
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

  const mutate = ({ username }: ChangeUsernameFormValues) =>
    startTransition(async () => {
      const { error } = await authClient.updateUser({ username, displayUsername: username });

      if (error) return handleError(error);

      toast.success("Username updated successfully 🎉", { duration: 10_000 });
      form.reset({ username });

      startTransition(() => router.refresh());
    });

  return { mutate, isPending };
};
