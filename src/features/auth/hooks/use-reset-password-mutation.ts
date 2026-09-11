import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants/rate-limit-error-code";

import { authClient } from "@/features/auth/lib/auth-client";
import type { AuthClientError } from "@/features/auth/types/auth-client-error";
import type { ResetPasswordFormValues } from "@/features/auth/types/reset-password-form-values";
import { getAuthErrorCode } from "@/features/auth/utils/get-auth-error-code";
import { unwrapAuthResponse } from "@/features/auth/utils/unwrap-auth-response";

interface Props {
  token: string;
}

export const useResetPasswordMutation = ({ token }: Props) => {
  const router = useRouter();

  return useMutation({
    mutationFn: ({ password }: ResetPasswordFormValues) =>
      unwrapAuthResponse(authClient.resetPassword({ newPassword: password, token })),
    onSuccess: () => {
      toast.success("Password reset", {
        description: "Sign in with your new password.",
      });

      router.push("/sign-in");
    },
    onError: (error: AuthClientError) => {
      if (error.status === RATE_LIMIT_ERROR_CODE) return;

      switch (getAuthErrorCode(error)) {
        case "INVALID_TOKEN":
          toast.error("This reset link has expired", {
            description: "Request a new one to reset your password.",
            action: {
              label: "Request new link",
              onClick: () => router.push("/forgot-password"),
            },
          });
          return;

        default:
          toast.error("Something went wrong", {
            description: "Please try again in a moment.",
          });
          return;
      }
    },
  });
};
