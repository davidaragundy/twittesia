import { useTransition } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants";
import { authClient } from "@/shared/lib/better-auth/client";

import type { AuthClientError } from "@/features/auth/types";
import type { ToggleTwoFactorFormValues } from "@/features/settings/types";

interface Props {
  form: UseFormReturn<ToggleTwoFactorFormValues>;
  // Called with the enrolment details; two-factor turns on once the code is verified
  onEnrolled: (enrolment: { totpURI: string; backupCodes: string[] }) => void;
}

export const useEnableTwoFactorMutation = ({ form, onEnrolled }: Props) => {
  const [isPending, startTransition] = useTransition();

  const handleError = (error: AuthClientError) => {
    if (error.status === RATE_LIMIT_ERROR_CODE) return;

    switch (error.code) {
      case "INVALID_PASSWORD":
        form.setError("currentPassword", { message: "Invalid password" });
        return;

      default:
        toast.error("Failed to enable two-factor authentication", {
          description: "Please try again later.",
          duration: 10_000,
        });
        return;
    }
  };

  const mutate = ({ password }: { password: string }) =>
    startTransition(async () => {
      const { data, error } = await authClient.twoFactor.enable({ password, method: "totp" });

      if (error) return handleError(error);

      // Only TOTP enrolment returns the URI and backup codes the setup dialog shows
      if (data.method !== "totp") {
        toast.error("Failed to enable two-factor authentication", {
          description: "Please try again later.",
          duration: 10_000,
        });
        return;
      }

      startTransition(() => onEnrolled({ totpURI: data.totpURI, backupCodes: data.backupCodes }));
      form.reset({ enableTwoFactor: true, currentPassword: "" });
    });

  return { mutate, isPending };
};
