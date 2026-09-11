import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useSession } from "@/features/auth/hooks/use-session";
import { useGenerateBackupCodesMutation } from "@/features/settings/hooks/use-generate-backup-codes-mutation";
import { generateBackupCodesFormSchema } from "@/features/settings/schemas/generate-backup-codes-form-schema";
import type { GenerateBackupCodesFormValues } from "@/features/settings/types/generate-backup-codes-form-values";

export const useGenerateBackupCodesForm = () => {
  const session = useSession();

  const form = useForm<GenerateBackupCodesFormValues>({
    resolver: zodResolver(generateBackupCodesFormSchema),
    defaultValues: {
      currentPassword: "",
    },
  });

  const { mutate, isPending } = useGenerateBackupCodesMutation({ form });

  const onSubmit = (values: GenerateBackupCodesFormValues) => mutate(values);

  return {
    form,
    onSubmit,
    isPending,
    isTwoFactorEnabled: !!session?.user.twoFactorEnabled,
  };
};
