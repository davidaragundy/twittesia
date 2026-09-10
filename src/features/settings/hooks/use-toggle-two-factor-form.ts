import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useSession } from "@/features/auth/hooks/use-session";
import { useEnableTwoFactorMutation } from "@/features/settings/hooks/use-enable-two-factor-mutation";
import { useDisableTwoFactorMutation } from "@/features/settings/hooks/use-disable-two-factor-mutation";
import { toggleTwoFactorFormSchema } from "@/features/settings/schemas/toggle-two-factor-form-schema";
import type { ToggleTwoFactorFormValues } from "@/features/settings/types";

export const useToggleTwoFactorForm = () => {
  const {
    data: session,
    isSuccess: isSessionSuccess,
    isLoading: isSessionLoading,
    isError: isSessionError,
    refetch: refetchSession,
    isRefetching: isSessionRefetching,
  } = useSession();

  const form = useForm<ToggleTwoFactorFormValues>({
    resolver: zodResolver(toggleTwoFactorFormSchema),
    values: {
      enableTwoFactor: !!session?.user.twoFactorEnabled,
      currentPassword: "",
    },
  });

  const [totpURI, setTotpURI] = useState<string>("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);

  const {
    mutate: enableTwoFactor,
    isPending: isEnableTwoFactorPending,
    isError: isEnableTwoFactorError,
  } = useEnableTwoFactorMutation({
    form,
    setTotpURI,
    setBackupCodes,
  });

  const {
    mutate: disableTwoFactor,
    isPending: isDisableTwoFactorPending,
    isError: isDisableTwoFactorError,
  } = useDisableTwoFactorMutation({
    form,
  });

  const onSubmit = (values: ToggleTwoFactorFormValues) => {
    if (values.enableTwoFactor)
      return enableTwoFactor({
        password: values.currentPassword,
      });

    if (!values.enableTwoFactor)
      return disableTwoFactor({
        password: values.currentPassword,
      });
  };

  const isSwitchDirty = form.watch("enableTwoFactor") !== !!session?.user.twoFactorEnabled;

  return {
    form,
    onSubmit,
    isPending: isEnableTwoFactorPending || isDisableTwoFactorPending,
    isError: isEnableTwoFactorError || isDisableTwoFactorError,
    isSessionSuccess,
    isSessionLoading,
    isSessionError,
    refetchSession,
    isSessionRefetching,
    totpURI,
    setTotpURI,
    backupCodes,
    setBackupCodes,
    isSwitchDirty,
  };
};
