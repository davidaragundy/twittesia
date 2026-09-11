import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { authClient } from "@/features/auth/lib/auth-client";
import type { AuthClientError } from "@/features/auth/types/auth-client-error";
import type { ForgotPasswordFormValues } from "@/features/auth/types/forgot-password-form-values";
import { handleAuthError } from "@/features/auth/utils/handle-auth-error";
import { unwrapAuthResponse } from "@/features/auth/utils/unwrap-auth-response";

export const useForgotPasswordMutation = () =>
  useMutation({
    mutationFn: ({ email }: ForgotPasswordFormValues) =>
      unwrapAuthResponse(authClient.requestPasswordReset({ email, redirectTo: "/reset-password" })),
    onSuccess: () => {
      toast.success("Reset link sent", {
        description: "Check your inbox, or your spam folder, for the link.",
      });
    },
    onError: (error: AuthClientError) => {
      handleAuthError(error, {
        FAILED_TO_SEND_RESET_PASSWORD_EMAIL: () => {
          toast.error("Couldn't send the reset link", {
            description: "Please try again in a moment.",
          });
        },
        fallback: () => {
          toast.error("Something went wrong", {
            description: "Please try again in a moment.",
          });
        },
      });
    },
  });
