import { useMutation } from "@tanstack/react-query";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants/rate-limit-error-code";

import { authClient } from "@/features/auth/lib/auth-client";
import type { AuthClientError } from "@/features/auth/types/auth-client-error";
import { getAuthErrorCode } from "@/features/auth/utils/get-auth-error-code";
import { unwrapAuthResponse } from "@/features/auth/utils/unwrap-auth-response";
import type { GenerateBackupCodesFormValues } from "@/features/settings/types/generate-backup-codes-form-values";
import { downloadBackupCodes } from "@/features/settings/utils/download-backup-codes";

interface Props {
  form: UseFormReturn<GenerateBackupCodesFormValues>;
}

export const useGenerateBackupCodesMutation = ({ form }: Props) =>
  useMutation({
    mutationFn: ({ currentPassword }: GenerateBackupCodesFormValues) =>
      unwrapAuthResponse(authClient.twoFactor.generateBackupCodes({ password: currentPassword })),
    onSuccess: (data) => {
      downloadBackupCodes(data.backupCodes);

      toast.success("Backup codes generated successfully 🎉", { duration: 10_000 });
      form.reset();
    },
    onError: (error: AuthClientError) => {
      if (error.status === RATE_LIMIT_ERROR_CODE) return;

      switch (getAuthErrorCode(error)) {
        case "INVALID_PASSWORD":
          form.setError("currentPassword", { message: "Invalid password" });
          return;

        default:
          toast.error("Failed to generate backup codes 😢", {
            description: "Please try again later",
            duration: 10_000,
          });
          return;
      }
    },
  });
