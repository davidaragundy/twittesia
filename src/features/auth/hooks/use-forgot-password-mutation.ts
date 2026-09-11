import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants/rate-limit-error-code";

import { authClient } from "@/features/auth/lib/auth-client";
import type { AuthClientError } from "@/features/auth/types/auth-client-error";
import type { ForgotPasswordFormValues } from "@/features/auth/types/forgot-password-form-values";
import { getAuthErrorCode } from "@/features/auth/utils/get-auth-error-code";
import { unwrapAuthResponse } from "@/features/auth/utils/unwrap-auth-response";

export const useForgotPasswordMutation = () =>
  useMutation({
    mutationFn: ({ email }: ForgotPasswordFormValues) =>
      unwrapAuthResponse(authClient.requestPasswordReset({ email, redirectTo: "/reset-password" })),
    onSuccess: () => {
      toast.success("Reset link sent successfully 🎉", {
        description: "Check your inbox (or spam folder) for the link.",
        duration: 10_000,
      });
    },
    onError: (error: AuthClientError) => {
      if (error.status === RATE_LIMIT_ERROR_CODE) return;

      switch (getAuthErrorCode(error)) {
        case "FAILED_TO_SEND_RESET_PASSWORD_EMAIL":
          toast.error("Failed to send reset password email 😢", {
            description: "Please try again later",
            duration: 10_000,
          });
          return;

        default:
          toast.error("Something went wrong 😢", {
            description: "Please try again later",
            duration: 10_000,
          });
          return;
      }
    },
  });
