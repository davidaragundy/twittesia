import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useForgotPasswordMutation } from "@/features/auth/hooks/use-forgot-password-mutation";
import { forgotPasswordFormSchema } from "@/features/auth/schemas/forgot-password-form-schema";
import type { ForgotPasswordFormValues } from "@/features/auth/types";

export const useForgotPasswordForm = () => {
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutate, isPending } = useForgotPasswordMutation();

  const onSubmit = (values: ForgotPasswordFormValues) => mutate(values);

  return {
    form,
    onSubmit,
    isPending,
  };
};
