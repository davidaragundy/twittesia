import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants/rate-limit-error-code";

import { authClient } from "@/features/auth/lib/auth-client";
import type { AuthClientError } from "@/features/auth/types/auth-client-error";
import { getAuthErrorCode } from "@/features/auth/utils/get-auth-error-code";
import { unwrapAuthResponse } from "@/features/auth/utils/unwrap-auth-response";
import type { ChangeUsernameFormValues } from "@/features/settings/types/change-username-form-values";

interface Props {
  form: UseFormReturn<ChangeUsernameFormValues>;
}

export const useChangeUsernameMutation = ({ form }: Props) => {
  const router = useRouter();

  return useMutation({
    mutationFn: ({ username }: ChangeUsernameFormValues) =>
      unwrapAuthResponse(authClient.updateUser({ username, displayUsername: username })),
    onSuccess: (_data, values) => {
      toast.success("Username updated");
      form.reset(values);
      router.refresh();
    },
    onError: (error: AuthClientError) => {
      if (error.status === RATE_LIMIT_ERROR_CODE) return;

      switch (getAuthErrorCode(error)) {
        case "USERNAME_IS_ALREADY_TAKEN":
          form.setError("username", { message: "Username is already taken. Please try another." });
          return;

        default:
          toast.error("Couldn't change your username", {
            description: "Please try again in a moment.",
          });
          return;
      }
    },
  });
};
