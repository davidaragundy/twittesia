import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import type { AuthClientError } from "@/features/auth/types";
import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants";
import { authClient } from "@/shared/lib/better-auth/client";

import type { ForgotPasswordFormValues } from "@/features/auth/types";

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: async (values: ForgotPasswordFormValues) => {
      const { error } = await authClient.requestPasswordReset({
        email: values.email,
        redirectTo: "/reset-password",
      });

      if (error) return Promise.reject(error);
    },
    onSuccess: () => {
      toast.success("Reset link sent successfully 🎉", {
        description: "Check your inbox (or spam folder) for the link.",
        duration: 10_000,
      });
    },
    onError: (error: AuthClientError) => {
      if (error.status === RATE_LIMIT_ERROR_CODE) return;

      switch (error.code) {
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
};
