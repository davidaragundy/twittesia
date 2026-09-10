import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import type { AuthClientError } from "@/features/auth/types";
import { SESSION_QUERY_KEY } from "@/features/auth/lib/query-keys";
import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants";
import { authClient } from "@/shared/lib/better-auth/client";

import { SESSIONS_QUERY_KEY } from "@/features/settings/lib/react-query/query-keys";
import type { ChangePasswordFormValues } from "@/features/settings/types";

interface Props {
  form: UseFormReturn<ChangePasswordFormValues>;
}

export const useChangePasswordMutation = ({ form }: Props) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ currentPassword, newPassword }: ChangePasswordFormValues) => {
      const { error } = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });

      if (error) return Promise.reject(error);
    },
    onSuccess: () => {
      toast.success("Password changed successfully 🎉", {
        duration: 10_000,
      });

      form.reset();
    },
    onError: (error: AuthClientError) => {
      if (error.status === RATE_LIMIT_ERROR_CODE) return;

      switch (error.code) {
        case "INVALID_PASSWORD":
          form.setError("currentPassword", {
            message: "Invalid password",
          });
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
    onSettled: () => {
      Promise.all([
        queryClient.invalidateQueries({ queryKey: [SESSION_QUERY_KEY] }),
        queryClient.invalidateQueries({ queryKey: [SESSIONS_QUERY_KEY] }),
      ]);
    },
  });
};
