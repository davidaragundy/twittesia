import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants/rate-limit-error-code";

import { useSession } from "@/features/auth/hooks/use-session";
import { authClient } from "@/features/auth/lib/auth-client";
import type { AuthClientError } from "@/features/auth/types/auth-client-error";
import { getAuthErrorCode } from "@/features/auth/utils/get-auth-error-code";
import { toggleTwoFactorFormSchema } from "@/features/settings/schemas/toggle-two-factor-form-schema";
import type { ToggleTwoFactorFormValues } from "@/features/settings/types/toggle-two-factor-form-values";

export const useToggleTwoFactorForm = () => {
  const router = useRouter();
  const session = useSession();
  const [isPending, startTransition] = useTransition();

  const [totpURI, setTotpURI] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);

  // Two-factor turns on server-side only once the code is verified,
  // so it counts as enabled while the setup dialog is waiting for that code
  const isEnabled = !!session?.user.twoFactorEnabled || !!totpURI;

  const form = useForm<ToggleTwoFactorFormValues>({
    resolver: zodResolver(toggleTwoFactorFormSchema),
    values: {
      enableTwoFactor: isEnabled,
      currentPassword: "",
    },
  });

  const isSwitchDirty = form.watch("enableTwoFactor") !== isEnabled;

  const handleError = (error: AuthClientError, action: "enable" | "disable") => {
    if (error.status === RATE_LIMIT_ERROR_CODE) return;

    switch (getAuthErrorCode(error)) {
      case "INVALID_PASSWORD":
        form.setError("currentPassword", { message: "Invalid password" });
        return;

      default:
        toast.error(`Failed to ${action} two-factor authentication 😢`, {
          description: "Please try again later",
          duration: 10_000,
        });
        return;
    }
  };

  const enable = (password: string) =>
    startTransition(async () => {
      const { data, error } = await authClient.twoFactor.enable({ password, method: "totp" });

      if (error) return handleError(error, "enable");

      // Only TOTP enrolment returns the URI and backup codes the setup dialog shows
      if (data.method !== "totp") {
        toast.error("Failed to enable two-factor authentication 😢", {
          description: "Please try again later",
          duration: 10_000,
        });
        return;
      }

      startTransition(() => {
        setTotpURI(data.totpURI);
        setBackupCodes(data.backupCodes);
      });
      form.reset({ enableTwoFactor: true, currentPassword: "" });
    });

  const disable = (password: string) =>
    startTransition(async () => {
      const { error } = await authClient.twoFactor.disable({ password });

      if (error) return handleError(error, "disable");

      toast.success("Two-factor authentication has been disabled successfully 🎉", {
        duration: 10_000,
      });
      form.reset({ enableTwoFactor: false, currentPassword: "" });

      startTransition(() => router.refresh());
    });

  const onSubmit = ({ enableTwoFactor, currentPassword }: ToggleTwoFactorFormValues) =>
    enableTwoFactor ? enable(currentPassword) : disable(currentPassword);

  return {
    form,
    onSubmit,
    isPending,
    totpURI,
    setTotpURI,
    backupCodes,
    setBackupCodes,
    isSwitchDirty,
  };
};
