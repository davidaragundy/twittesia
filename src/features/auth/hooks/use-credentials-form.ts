import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { tryCatch } from "@/shared/utils/try-catch";

import { useCredentialsMutation } from "@/features/auth/hooks/use-credentials-mutation";
import { credentialsFormSchema } from "@/features/auth/schemas/credentials-form-schema";
import type { CredentialsFormValues } from "@/features/auth/types";

export const useCredentialsForm = () => {
  const form = useForm<CredentialsFormValues>({
    resolver: zodResolver(credentialsFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutateAsync: signIn, isPending } = useCredentialsMutation({
    form,
  });

  const onSubmit = async (values: CredentialsFormValues) => {
    await tryCatch(signIn(values));
  };

  return { form, onSubmit, isPending };
};
