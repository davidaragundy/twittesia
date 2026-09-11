import { useTransition } from "react";
import { toast } from "sonner";

import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants";
import { authClient } from "@/shared/lib/better-auth/client";

import type { AuthClientError, ForgotPasswordFormValues } from "@/features/auth/types";

export const useForgotPasswordMutation = () => {
  const [isPending, startTransition] = useTransition();

  const handleError = (error: AuthClientError) => {
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
  };

  const mutate = (values: ForgotPasswordFormValues) =>
    startTransition(async () => {
      const { error } = await authClient.requestPasswordReset({
        email: values.email,
        redirectTo: "/reset-password",
      });

      if (error) return handleError(error);

      toast.success("Reset link sent successfully 🎉", {
        description: "Check your inbox (or spam folder) for the link.",
        duration: 10_000,
      });
    });

  return { mutate, isPending };
};
