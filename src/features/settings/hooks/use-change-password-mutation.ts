import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants/rate-limit-error-code";

import { authClient } from "@/features/auth/lib/auth-client";
import type { AuthClientError } from "@/features/auth/types/auth-client-error";
import { getAuthErrorCode } from "@/features/auth/utils/get-auth-error-code";
import { unwrapAuthResponse } from "@/features/auth/utils/unwrap-auth-response";
import { ACTIVE_SESSIONS_QUERY_KEY } from "@/features/settings/constants/active-sessions-query-key";
import type { ChangePasswordFormValues } from "@/features/settings/types/change-password-form-values";

interface Props {
  form: UseFormReturn<ChangePasswordFormValues>;
}

export const useChangePasswordMutation = ({ form }: Props) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ currentPassword, newPassword }: ChangePasswordFormValues) =>
      unwrapAuthResponse(
        authClient.changePassword({ currentPassword, newPassword, revokeOtherSessions: true }),
      ),
    onSuccess: () => {
      toast.success("Password changed successfully 🎉", { duration: 10_000 });
      form.reset();

      // Every other session was revoked with the change
      queryClient.invalidateQueries({ queryKey: ACTIVE_SESSIONS_QUERY_KEY });
    },
    onError: (error: AuthClientError) => {
      if (error.status === RATE_LIMIT_ERROR_CODE) return;

      switch (getAuthErrorCode(error)) {
        case "INVALID_PASSWORD":
          form.setError("currentPassword", { message: "Invalid password" });
          return;

        case "PASSWORD_COMPROMISED":
          form.setError("newPassword", {
            message:
              "The password you entered has been compromised. Please choose a different password.",
          });
          return;

        default:
          toast.error("Failed to change password 😢", {
            description: "Please try again later",
            duration: 10_000,
          });
          return;
      }
    },
  });
};
