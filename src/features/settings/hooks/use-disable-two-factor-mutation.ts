import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants/rate-limit-error-code";

import { authClient } from "@/features/auth/lib/auth-client";
import type { AuthClientError } from "@/features/auth/types/auth-client-error";
import { getAuthErrorCode } from "@/features/auth/utils/get-auth-error-code";
import { unwrapAuthResponse } from "@/features/auth/utils/unwrap-auth-response";
import type { ToggleTwoFactorFormValues } from "@/features/settings/types/toggle-two-factor-form-values";

interface Props {
  form: UseFormReturn<ToggleTwoFactorFormValues>;
}

export const useDisableTwoFactorMutation = ({ form }: Props) => {
  const router = useRouter();

  return useMutation({
    mutationFn: ({ currentPassword }: Pick<ToggleTwoFactorFormValues, "currentPassword">) =>
      unwrapAuthResponse(authClient.twoFactor.disable({ password: currentPassword })),
    onSuccess: () => {
      toast.success("Two-factor authentication turned off", {});
      form.reset({ enableTwoFactor: false, currentPassword: "" });
      router.refresh();
    },
    onError: (error: AuthClientError) => {
      if (error.status === RATE_LIMIT_ERROR_CODE) return;

      switch (getAuthErrorCode(error)) {
        case "INVALID_PASSWORD":
          form.setError("currentPassword", { message: "Invalid password" });
          return;

        default:
          toast.error("Couldn't turn off two-factor authentication", {
            description: "Please try again in a moment.",
          });
          return;
      }
    },
  });
};
