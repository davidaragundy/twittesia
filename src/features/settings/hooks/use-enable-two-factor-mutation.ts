import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants";
import { authClient } from "@/shared/lib/better-auth/client";

import { SESSION_QUERY_KEY } from "@/features/auth/lib/query-keys";
import type { AuthClientError, Session } from "@/features/auth/types";
import type { ToggleTwoFactorFormValues } from "@/features/settings/types";

interface Props {
  form: UseFormReturn<ToggleTwoFactorFormValues>;
  setTotpURI: Dispatch<SetStateAction<string>>;
  setBackupCodes: Dispatch<SetStateAction<string[]>>;
}

export const useEnableTwoFactorMutation = ({ form, setBackupCodes, setTotpURI }: Props) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ password }: { password: string }) => {
      const { data, error } = await authClient.twoFactor.enable({
        password,
      });

      if (error) return Promise.reject(error);

      return data;
    },
    onSuccess: (data) => {
      setTotpURI(data.totpURI);
      setBackupCodes(data.backupCodes);

      queryClient.setQueryData([SESSION_QUERY_KEY], (old: Session): Session => {
        return {
          session: old.session,
          user: { ...old.user, twoFactorEnabled: true },
        };
      });

      form.reset({ enableTwoFactor: true });
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
          toast.error("Failed to enable two-factor authentication", {
            description: "Please try again later.",
            duration: 10_000,
          });
          return;
      }
    },
  });
};
