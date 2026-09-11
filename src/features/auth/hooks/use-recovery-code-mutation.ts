import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants/rate-limit-error-code";

import { authClient } from "@/features/auth/lib/auth-client";
import type { AuthClientError } from "@/features/auth/types/auth-client-error";
import type { RecoveryCodeFormValues } from "@/features/auth/types/recovery-code-form-values";
import { getAuthErrorCode } from "@/features/auth/utils/get-auth-error-code";
import { unwrapAuthResponse } from "@/features/auth/utils/unwrap-auth-response";

interface Props {
  form: UseFormReturn<RecoveryCodeFormValues>;
}

export const useRecoveryCodeMutation = ({ form }: Props) => {
  const router = useRouter();

  return useMutation({
    mutationFn: ({ code }: RecoveryCodeFormValues) =>
      unwrapAuthResponse(authClient.twoFactor.verifyBackupCode({ code })),
    onSuccess: () => {
      toast.info("Recovery code used", {
        description:
          "Each code works only once. Generate new ones in settings, and reset your password if you've forgotten it.",
        duration: 20_000,
        closeButton: true,
        action: {
          label: "Go to settings",
          onClick: () => router.push("/home?settings=security"),
        },
      });

      router.push("/home");
    },
    onError: (error: AuthClientError) => {
      if (error.status === RATE_LIMIT_ERROR_CODE) return;

      switch (getAuthErrorCode(error)) {
        case "INVALID_BACKUP_CODE":
          form.setError("code", { message: "Invalid code" });
          return;

        default:
          toast.error("Something went wrong", { description: "Please try again in a moment." });
          return;
      }
    },
  });
};
