import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useRecoveryCodeMutation } from "@/features/auth/hooks/use-recovery-code-mutation";
import { recoveryCodeFormSchema } from "@/features/auth/schemas/recovery-code-form-schema";
import type { RecoveryCodeFormValues } from "@/features/auth/types";

export const useRecoveryCodeForm = () => {
  const form = useForm<RecoveryCodeFormValues>({
    resolver: zodResolver(recoveryCodeFormSchema),
    defaultValues: {
      code: "",
    },
  });

  const { mutate, isPending } = useRecoveryCodeMutation({ form });

  const onSubmit = async (values: RecoveryCodeFormValues) => mutate(values);

  return { form, onSubmit, isPending };
};
