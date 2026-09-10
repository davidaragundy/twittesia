import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants";
import { authClient } from "@/shared/lib/better-auth/client";

import type { AuthClientError } from "@/features/auth/types";
import type { RecoveryCodeFormValues } from "@/features/auth/types";

interface Props {
  form: UseFormReturn<RecoveryCodeFormValues>;
}

export const useRecoveryCodeMutation = ({ form }: Props) => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (values: RecoveryCodeFormValues) => {
      const { error } = await authClient.twoFactor.verifyBackupCode({
        code: values.code,
      });

      if (error) return Promise.reject(error);
    },
    onSuccess: () => {
      toast.info(
        "Please note that each recovery code can only be used once. If you have used all your recovery codes, you can generate new ones in your account settings. If you don't remember your password, this is a good time to reset it.",
        {
          dismissible: false,
          closeButton: true,
          duration: 20_000,
          action: {
            label: "Go to settings",
            onClick: () => router.push("/home?settings=security"),
          },
        },
      );

      router.push("/home");
    },
    onError: (error: AuthClientError) => {
      if (error.status === RATE_LIMIT_ERROR_CODE) return;

      switch (error.code) {
        case "INVALID_BACKUP_CODE":
          form.setError("code", {
            message: "Invalid code",
          });
          return;

        default:
          toast.error("Something went wrong, please try again later 😢");
          return;
      }
    },
  });
};
