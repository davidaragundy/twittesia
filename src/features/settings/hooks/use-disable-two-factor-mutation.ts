import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { SESSION_QUERY_KEY } from "@/features/auth/lib/query-keys";
import type { AuthClientError, Session } from "@/features/auth/types";
import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants";
import { authClient } from "@/shared/lib/better-auth/client";

import { SESSIONS_QUERY_KEY } from "@/features/settings/lib/react-query/query-keys";
import type { ToggleTwoFactorFormValues } from "@/features/settings/types";

interface Props {
  form: UseFormReturn<ToggleTwoFactorFormValues>;
}

export const useDisableTwoFactorMutation = ({ form }: Props) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ password }: { password: string }) => {
      const { error } = await authClient.twoFactor.disable({
        password,
      });

      if (error) return Promise.reject(error);
    },
    onSuccess: () => {
      toast.success("Two-factor authentication has been disabled successfully 🎉", {
        duration: 10_000,
      });

      queryClient.setQueryData([SESSION_QUERY_KEY], (old: Session): Session => {
        return {
          session: old.session,
          user: { ...old.user, twoFactorEnabled: false },
        };
      });

      form.reset({ enableTwoFactor: false });
    },
    onError: (error: AuthClientError) => {
      if (error.status === RATE_LIMIT_ERROR_CODE) return;

      switch (error.code) {
        case "INVALID_PASSWORD":
          form.setError("currentPassword", {
            message: "Invalid password",
          });
          return;

        default:
          toast.error("Failed to disable two-factor authentication 😢", {
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
