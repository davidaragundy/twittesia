import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants/rate-limit-error-code";

import { authClient } from "@/features/auth/lib/auth-client";
import { resetPasswordFormSchema } from "@/features/auth/schemas/reset-password-form-schema";
import type { AuthClientError } from "@/features/auth/types/auth-client-error";
import type { ResetPasswordFormValues } from "@/features/auth/types/reset-password-form-values";
import { getAuthErrorCode } from "@/features/auth/utils/get-auth-error-code";

export const useResetPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // The route redirects to /forgot-password before rendering this form without a token
  const token = searchParams.get("token") ?? "";

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const handleError = (error: AuthClientError) => {
    if (error.status === RATE_LIMIT_ERROR_CODE) return;

    switch (getAuthErrorCode(error)) {
      case "INVALID_TOKEN":
        toast.error("Invalid token 😢", {
          description: "Please request a new password reset link.",
          duration: 10_000,
          action: {
            label: "Request new link",
            onClick: () => router.push("/forgot-password"),
          },
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

  const onSubmit = ({ password }: ResetPasswordFormValues) =>
    startTransition(async () => {
      const { error } = await authClient.resetPassword({ newPassword: password, token });

      if (error) return handleError(error);

      toast.success("Password reset successfully 🎉", {
        description: "You can now sign in with your new password.",
        duration: 10_000,
      });

      startTransition(() => router.push("/sign-in"));
    });

  return { form, onSubmit, isPending };
};
