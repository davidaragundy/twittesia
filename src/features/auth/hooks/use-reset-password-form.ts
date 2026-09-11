import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

import { useResetPasswordMutation } from "@/features/auth/hooks/use-reset-password-mutation";
import { resetPasswordFormSchema } from "@/features/auth/schemas/reset-password-form-schema";
import type { ResetPasswordFormValues } from "@/features/auth/types/reset-password-form-values";

export const useResetPasswordForm = () => {
  const searchParams = useSearchParams();

  // The route redirects to /forgot-password before rendering this form without a token
  const token = searchParams.get("token") ?? "";

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate, isPending } = useResetPasswordMutation({ token });

  const onSubmit = (values: ResetPasswordFormValues) => mutate(values);

  return { form, onSubmit, isPending };
};
