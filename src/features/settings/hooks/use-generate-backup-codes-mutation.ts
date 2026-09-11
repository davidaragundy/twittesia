import { useMutation } from "@tanstack/react-query";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { authClient } from "@/features/auth/lib/auth-client";
import type { AuthClientError } from "@/features/auth/types/auth-client-error";
import { handleAuthError } from "@/features/auth/utils/handle-auth-error";
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

      toast.success("New backup codes downloaded");
      form.reset();
    },
    onError: (error: AuthClientError) => {
      handleAuthError(error, {
        INVALID_PASSWORD: () => {
          form.setError("currentPassword", { message: "Invalid password" });
        },
        fallback: () => {
          toast.error("Couldn't generate backup codes", {
            description: "Please try again in a moment.",
          });
        },
      });
    },
  });
