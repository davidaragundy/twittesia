import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { toastRateLimited } from "@/shared/utils/toast-rate-limited";

import { useSession } from "@/features/auth/hooks/use-session";
import { generateBackupCodes } from "@/features/settings/actions/generate-backup-codes";
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

  const onSubmit = (values: GenerateBackupCodesFormValues) =>
    startTransition(async () => {
      const { data, error } = await generateBackupCodes(values);

      switch (error?.code) {
        case undefined:
          break;

        case "INVALID_PASSWORD":
          form.setError("currentPassword", { message: "Invalid password" });
          return;

        case "RATE_LIMITED":
          toastRateLimited();
          return;

        // Client validation normally stops this first; show why the server refused
        case "INVALID_INPUT":
          toast.error(error.message, { duration: 10_000 });
          return;

        default:
          toast.error("Failed to generate backup codes 😢", {
            description: "Please try again later",
            duration: 10_000,
          });
          return;
      }

      if (data) downloadBackupCodes(data.backupCodes);

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
