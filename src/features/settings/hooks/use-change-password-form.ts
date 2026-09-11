import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants/rate-limit-error-code";

import { authClient } from "@/features/auth/lib/auth-client";
import type { AuthClientError } from "@/features/auth/types/auth-client-error";
import { getAuthErrorCode } from "@/features/auth/utils/get-auth-error-code";
import { changePasswordFormSchema } from "@/features/settings/schemas/change-password-form-schema";
import type { ChangePasswordFormValues } from "@/features/settings/types/change-password-form-values";

export const useChangePasswordForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<ChangePasswordFormValues>({
    mode: "onChange",
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  const handleError = (error: AuthClientError) => {
    if (error.status === RATE_LIMIT_ERROR_CODE) return;

    switch (getAuthErrorCode(error)) {
      case "INVALID_PASSWORD":
        form.setError("currentPassword", { message: "Invalid password" });
        return;

      case "PASSWORD_COMPROMISED":
        form.setError("newPassword", {
          message:
            "The password you entered has been compromised. Please choose a different password.",
        });
        return;

      default:
        toast.error("Failed to change password 😢", {
          description: "Please try again later",
          duration: 10_000,
        });
        return;
    }
  };

  const onSubmit = ({ currentPassword, newPassword }: ChangePasswordFormValues) =>
    startTransition(async () => {
      const { error } = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });

      if (error) return handleError(error);

      toast.success("Password changed successfully 🎉", { duration: 10_000 });
      form.reset();

      // Other sessions were revoked, so the session list needs fresh data too
      startTransition(() => router.refresh());
    });

  return { form, onSubmit, isPending };
};
