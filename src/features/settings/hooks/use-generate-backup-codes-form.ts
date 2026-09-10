import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useSession } from "@/features/auth/hooks/use-session";
import { useGenerateBackupCodesMutation } from "@/features/settings/hooks/use-generate-backup-codes-mutation";
import { generateBackupCodesFormSchema } from "@/features/settings/schemas/generate-backup-codes-form-schema";
import type { GenerateBackupCodesFormValues } from "@/features/settings/types";

export const useGenerateBackupCodesForm = () => {
  const { data: session } = useSession();

  const form = useForm<GenerateBackupCodesFormValues>({
    resolver: zodResolver(generateBackupCodesFormSchema),
    defaultValues: {
      generateBackupCodes: false,
      currentPassword: "",
    },
  });

  const { mutate, isPending, isError } = useGenerateBackupCodesMutation({
    form,
  });

  const onSubmit = (values: GenerateBackupCodesFormValues) =>
    mutate({
      password: values.currentPassword,
    });

  const isGenerateBackupCodesDirty =
    form.watch("generateBackupCodes") && session?.user.twoFactorEnabled;

  return {
    form,
    onSubmit,
    isPending,
    isError,
    isTwoFactorEnabled: !!session?.user.twoFactorEnabled,
    isGenerateBackupCodesDirty,
  };
};
