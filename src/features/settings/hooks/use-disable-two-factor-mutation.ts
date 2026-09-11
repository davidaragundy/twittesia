import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { authClient } from "@/features/auth/lib/auth-client";
import type { AuthClientError } from "@/features/auth/types/auth-client-error";
import { handleAuthError } from "@/features/auth/utils/handle-auth-error";
import { unwrapAuthResponse } from "@/features/auth/utils/unwrap-auth-response";
import type { ToggleTwoFactorFormValues } from "@/features/settings/types/toggle-two-factor-form-values";

interface Props {
  form: UseFormReturn<ToggleTwoFactorFormValues>;
}

export const useDisableTwoFactorMutation = ({ form }: Props) => {
  const router = useRouter();

  return useMutation({
    mutationFn: ({ currentPassword }: Pick<ToggleTwoFactorFormValues, "currentPassword">) =>
      unwrapAuthResponse(authClient.twoFactor.disable({ password: currentPassword })),
    onSuccess: () => {
      toast.success("Two-factor authentication turned off", {});
      form.reset({ enableTwoFactor: false, currentPassword: "" });
      router.refresh();
    },
    onError: (error: AuthClientError) => {
      handleAuthError(error, {
        INVALID_PASSWORD: () => {
          form.setError("currentPassword", { message: "Invalid password" });
        },
        fallback: () => {
          toast.error("Couldn't turn off two-factor authentication", {
            description: "Please try again in a moment.",
          });
        },
      });
    },
  });
};
