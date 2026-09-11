import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants/rate-limit-error-code";

import { authClient } from "@/features/auth/lib/auth-client";
import { recoveryCodeFormSchema } from "@/features/auth/schemas/recovery-code-form-schema";
import type { AuthClientError } from "@/features/auth/types/auth-client-error";
import type { RecoveryCodeFormValues } from "@/features/auth/types/recovery-code-form-values";
import { getAuthErrorCode } from "@/features/auth/utils/get-auth-error-code";

export const useRecoveryCodeForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<RecoveryCodeFormValues>({
    resolver: zodResolver(recoveryCodeFormSchema),
    defaultValues: {
      code: "",
    },
  });

  const handleError = (error: AuthClientError) => {
    if (error.status === RATE_LIMIT_ERROR_CODE) return;

    switch (getAuthErrorCode(error)) {
      case "INVALID_BACKUP_CODE":
        form.setError("code", { message: "Invalid code" });
        return;

      default:
        toast.error("Something went wrong, please try again later 😢");
        return;
    }
  };

  const onSubmit = ({ code }: RecoveryCodeFormValues) =>
    startTransition(async () => {
      const { error } = await authClient.twoFactor.verifyBackupCode({ code });

      if (error) return handleError(error);

      toast.info(
        "Please note that each recovery code can only be used once. If you have used all your recovery codes, you can generate new ones in your account settings. If you don't remember your password, this is a good time to reset it.",
        {
          dismissible: false,
          closeButton: true,
          duration: 20_000,
          action: {
            label: "Go to settings",
            onClick: () => router.push("/home?settings=security"),
          },
        },
      );

      startTransition(() => router.push("/home"));
    });

  return { form, onSubmit, isPending };
};
