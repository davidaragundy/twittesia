import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { useSession } from "@/features/auth/hooks/use-session";
import { useDisableTwoFactorMutation } from "@/features/settings/hooks/use-disable-two-factor-mutation";
import { useEnableTwoFactorMutation } from "@/features/settings/hooks/use-enable-two-factor-mutation";
import { toggleTwoFactorFormSchema } from "@/features/settings/schemas/toggle-two-factor-form-schema";
import type { ToggleTwoFactorFormValues } from "@/features/settings/types";

export const useToggleTwoFactorForm = () => {
  const session = useSession();

  const [totpURI, setTotpURI] = useState<string>("");
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

  const { mutate: enableTwoFactor, isPending: isEnablePending } = useEnableTwoFactorMutation({
    form,
    onEnrolled: (enrolment) => {
      setTotpURI(enrolment.totpURI);
      setBackupCodes(enrolment.backupCodes);
    },
  });

  const { mutate: disableTwoFactor, isPending: isDisablePending } = useDisableTwoFactorMutation({
    form,
  });

  const onSubmit = (values: ToggleTwoFactorFormValues) =>
    values.enableTwoFactor
      ? enableTwoFactor({ password: values.currentPassword })
      : disableTwoFactor({ password: values.currentPassword });

  const isSwitchDirty = form.watch("enableTwoFactor") !== isEnabled;

  return {
    form,
    onSubmit,
    isPending: isEnablePending || isDisablePending,
    totpURI,
    setTotpURI,
    backupCodes,
    setBackupCodes,
    isSwitchDirty,
  };
};
