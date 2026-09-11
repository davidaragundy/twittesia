import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants";
import { authClient } from "@/shared/lib/better-auth/client";

import type { AuthClientError } from "@/features/auth/types";
import type { ChangePasswordFormValues } from "@/features/settings/types";

interface Props {
  form: UseFormReturn<ChangePasswordFormValues>;
}

export const useChangePasswordMutation = ({ form }: Props) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleError = (error: AuthClientError) => {
    if (error.status === RATE_LIMIT_ERROR_CODE) return;

    switch (error.code) {
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

  const mutate = ({ currentPassword, newPassword }: ChangePasswordFormValues) =>
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

  return { mutate, isPending };
};
