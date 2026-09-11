import { useMutation } from "@tanstack/react-query";
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
  // Receives what enrolment returned; two-factor turns on once the code is verified
  onEnrolled: (enrolment: { totpURI: string; backupCodes: string[] }) => void;
}

export const useEnableTwoFactorMutation = ({ form, onEnrolled }: Props) =>
  useMutation({
    mutationFn: ({ currentPassword }: Pick<ToggleTwoFactorFormValues, "currentPassword">) =>
      unwrapAuthResponse(
        authClient.twoFactor.enable({ password: currentPassword, method: "totp" }),
      ),
    onSuccess: (data) => {
      // Only TOTP enrolment returns the URI and backup codes the setup dialog shows
      if (data.method !== "totp") {
        toast.error("Couldn't turn on two-factor authentication", {
          description: "Please try again in a moment.",
        });
        return;
      }

      form.reset({ enableTwoFactor: true, currentPassword: "" });
      onEnrolled({ totpURI: data.totpURI, backupCodes: data.backupCodes });
    },
    onError: (error: AuthClientError) => {
      if (error.status === RATE_LIMIT_ERROR_CODE) return;

      switch (getAuthErrorCode(error)) {
        case "INVALID_PASSWORD":
          form.setError("currentPassword", { message: "Invalid password" });
          return;

        default:
          toast.error("Couldn't turn on two-factor authentication", {
            description: "Please try again in a moment.",
          });
          return;
      }
    },
  });
