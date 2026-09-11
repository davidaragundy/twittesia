import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants/rate-limit-error-code";

import { useSession } from "@/features/auth/hooks/use-session";
import { authClient } from "@/features/auth/lib/auth-client";
import type { AuthClientError } from "@/features/auth/types/auth-client-error";
import { getAuthErrorCode } from "@/features/auth/utils/get-auth-error-code";
import { generateBackupCodesFormSchema } from "@/features/settings/schemas/generate-backup-codes-form-schema";
import type { GenerateBackupCodesFormValues } from "@/features/settings/types/generate-backup-codes-form-values";
import { downloadBackupCodes } from "@/features/settings/utils/download-backup-codes";

export const useGenerateBackupCodesForm = () => {
  const session = useSession();
  const [isPending, startTransition] = useTransition();

  const form = useForm<GenerateBackupCodesFormValues>({
    resolver: zodResolver(generateBackupCodesFormSchema),
    defaultValues: {
      currentPassword: "",
    },
  });

  const handleError = (error: AuthClientError) => {
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
  };

  const onSubmit = ({ currentPassword }: GenerateBackupCodesFormValues) =>
    startTransition(async () => {
      const { data, error } = await authClient.twoFactor.generateBackupCodes({
        password: currentPassword,
      });

      if (error) return handleError(error);

      downloadBackupCodes(data.backupCodes);

      toast.success("Backup codes generated successfully 🎉", { duration: 10_000 });
      form.reset();
    });

  return {
    form,
    onSubmit,
    isPending,
    isTwoFactorEnabled: !!session?.user.twoFactorEnabled,
  };
};
