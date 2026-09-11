import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants/rate-limit-error-code";

import { authClient } from "@/features/auth/lib/auth-client";
import { forgotPasswordFormSchema } from "@/features/auth/schemas/forgot-password-form-schema";
import type { AuthClientError } from "@/features/auth/types/auth-client-error";
import type { ForgotPasswordFormValues } from "@/features/auth/types/forgot-password-form-values";
import { getAuthErrorCode } from "@/features/auth/utils/get-auth-error-code";

export const useForgotPasswordForm = () => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleError = (error: AuthClientError) => {
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
  };

  const onSubmit = ({ email }: ForgotPasswordFormValues) =>
    startTransition(async () => {
      const { error } = await authClient.requestPasswordReset({
        email,
        redirectTo: "/reset-password",
      });

      if (error) return handleError(error);

      toast.success("Reset link sent successfully 🎉", {
        description: "Check your inbox (or spam folder) for the link.",
        duration: 10_000,
      });
    });

  return { form, onSubmit, isPending };
};
