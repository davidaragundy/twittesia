import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { useSession } from "@/features/auth/hooks/use-session";
import { useDisableTwoFactorMutation } from "@/features/settings/hooks/use-disable-two-factor-mutation";
import { useEnableTwoFactorMutation } from "@/features/settings/hooks/use-enable-two-factor-mutation";
import { toggleTwoFactorFormSchema } from "@/features/settings/schemas/toggle-two-factor-form-schema";
import type { ToggleTwoFactorFormValues } from "@/features/settings/types/toggle-two-factor-form-values";

export const useToggleTwoFactorForm = () => {
  const session = useSession();

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

  const { mutate: enableTwoFactor, isPending: isEnabling } = useEnableTwoFactorMutation({
    form,
    onEnrolled: (enrolment) => {
      setTotpURI(enrolment.totpURI);
      setBackupCodes(enrolment.backupCodes);
    },
  });

  const { mutate: disableTwoFactor, isPending: isDisabling } = useDisableTwoFactorMutation({
    form,
  });

  const onSubmit = ({ enableTwoFactor: enable, currentPassword }: ToggleTwoFactorFormValues) =>
    enable ? enableTwoFactor({ currentPassword }) : disableTwoFactor({ currentPassword });

  const isSwitchDirty = form.watch("enableTwoFactor") !== isEnabled;

  return {
    form,
    onSubmit,
    isPending: isEnabling || isDisabling,
    totpURI,
    setTotpURI,
    backupCodes,
    setBackupCodes,
    isSwitchDirty,
  };
};
