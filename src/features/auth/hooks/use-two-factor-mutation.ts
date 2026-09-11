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
}

export const useTwoFactorMutation = ({ form }: Props) => {
  const router = useRouter();

  return useMutation({
    mutationFn: ({ code }: TwoFactorFormValues) =>
      unwrapAuthResponse(authClient.twoFactor.verifyTotp({ code })),
    onSuccess: () => {
      form.reset();
      router.push("/home");
    },
    onError: (error: AuthClientError) => {
      handleAuthError(error, {
        INVALID_CODE: () => {
          form.setError("code", { message: "Invalid one-time password" });
        },
        fallback: () => {
          toast.error("Something went wrong", { description: "Please try again in a moment." });
        },
      });
    },
  });
};
