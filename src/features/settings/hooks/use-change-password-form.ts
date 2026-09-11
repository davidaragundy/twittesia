import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { toastRateLimited } from "@/shared/utils/toast-rate-limited";

import { changePassword } from "@/features/settings/actions/change-password";
import { changePasswordFormSchema } from "@/features/settings/schemas/change-password-form-schema";
import type { ChangePasswordFormValues } from "@/features/settings/types/change-password-form-values";

export const useChangePasswordForm = () => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<ChangePasswordFormValues>({
    mode: "onChange",
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  // Other sessions are revoked with the change; the action's refresh updates the list
  const onSubmit = (values: ChangePasswordFormValues) =>
    startTransition(async () => {
      const { error } = await changePassword(values);

      switch (error?.code) {
        case undefined:
          toast.success("Password changed successfully 🎉", { duration: 10_000 });
          form.reset();
          return;

        case "INVALID_PASSWORD":
          form.setError("currentPassword", { message: "Invalid password" });
          return;

        case "PASSWORD_COMPROMISED":
          form.setError("newPassword", {
            message:
              "The password you entered has been compromised. Please choose a different password.",
          });
          return;

        case "RATE_LIMITED":
          toastRateLimited();
          return;

        default:
          toast.error("Failed to change password 😢", {
            description: "Please try again later",
            duration: 10_000,
          });
          return;
      }
    });

  return { form, onSubmit, isPending };
};
