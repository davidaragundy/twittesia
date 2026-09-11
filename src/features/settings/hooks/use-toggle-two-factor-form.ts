import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { toastRateLimited } from "@/shared/utils/toast-rate-limited";

import { useSession } from "@/features/auth/hooks/use-session";
import { disableTwoFactor } from "@/features/settings/actions/disable-two-factor";
import { enableTwoFactor } from "@/features/settings/actions/enable-two-factor";
import { toggleTwoFactorFormSchema } from "@/features/settings/schemas/toggle-two-factor-form-schema";
import type { ToggleTwoFactorFormValues } from "@/features/settings/types/toggle-two-factor-form-values";

export const useToggleTwoFactorForm = () => {
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

  const onSubmit = ({ enableTwoFactor: enable, currentPassword }: ToggleTwoFactorFormValues) =>
    startTransition(async () => {
      const action = enable ? "enable" : "disable";
      const { data, error } = enable
        ? await enableTwoFactor({ currentPassword })
        : await disableTwoFactor({ currentPassword });

      switch (error?.code) {
        case undefined:
          break;

        case "INVALID_PASSWORD":
          form.setError("currentPassword", { message: "Invalid password" });
          return;

        case "RATE_LIMITED":
          toastRateLimited();
          return;

        default:
          toast.error(`Failed to ${action} two-factor authentication 😢`, {
            description: "Please try again later",
            duration: 10_000,
          });
          return;
      }

      form.reset({ enableTwoFactor: enable, currentPassword: "" });

      if (!data) {
        toast.success("Two-factor authentication has been disabled successfully 🎉", {
          duration: 10_000,
        });
        return;
      }

      // The setup dialog opens with what enrolment returned
      startTransition(() => {
        setTotpURI(data.totpURI);
        setBackupCodes(data.backupCodes);
      });
    });

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
