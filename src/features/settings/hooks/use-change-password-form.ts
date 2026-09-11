import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useChangePasswordMutation } from "@/features/settings/hooks/use-change-password-mutation";
import { changePasswordFormSchema } from "@/features/settings/schemas/change-password-form-schema";
import type { ChangePasswordFormValues } from "@/features/settings/types";

export const useChangePasswordForm = () => {
  const form = useForm<ChangePasswordFormValues>({
    mode: "onChange",
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  const { mutate, isPending } = useChangePasswordMutation({
    form,
  });

  const onSubmit = (values: ChangePasswordFormValues) => mutate(values);

  return {
    form,
    onSubmit,
    isPending,
  };
};
