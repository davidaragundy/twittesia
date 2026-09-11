import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { authClient } from "@/features/auth/lib/auth-client";
import type { AuthClientError } from "@/features/auth/types/auth-client-error";
import type { TwoFactorFormValues } from "@/features/auth/types/two-factor-form-values";
import { handleAuthError } from "@/features/auth/utils/handle-auth-error";
import { unwrapAuthResponse } from "@/features/auth/utils/unwrap-auth-response";

interface Props {
  form: UseFormReturn<TwoFactorFormValues>;
  closeDialog: () => void;
}

export const useVerifyTotpMutation = ({ form, closeDialog }: Props) => {
  const router = useRouter();

  return useMutation({
    mutationFn: ({ code }: TwoFactorFormValues) =>
      unwrapAuthResponse(authClient.twoFactor.verifyTotp({ code })),
    onSuccess: () => {
      toast.success("Two-factor authentication turned on");
      form.reset();
      closeDialog();

      // Shows two-factor as on, and the backup codes form that depends on it
      router.refresh();
    },
    onError: (error: AuthClientError) => {
      handleAuthError(error, {
        INVALID_CODE: () => {
          form.setError("code", { message: "Invalid one-time password" });
        },
        fallback: () => {
          toast.error("Something went wrong", {
            description: "Please try again in a moment.",
          });
        },
      });
    },
  });
};
