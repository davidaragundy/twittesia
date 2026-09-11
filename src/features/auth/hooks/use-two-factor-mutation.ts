import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants/rate-limit-error-code";

import { authClient } from "@/features/auth/lib/auth-client";
import type { AuthClientError } from "@/features/auth/types/auth-client-error";
import type { TwoFactorFormValues } from "@/features/auth/types/two-factor-form-values";
import { getAuthErrorCode } from "@/features/auth/utils/get-auth-error-code";
import { unwrapAuthResponse } from "@/features/auth/utils/unwrap-auth-response";

interface Props {
  form: UseFormReturn<TwoFactorFormValues>;
}

export const useTwoFactorMutation = ({ form }: Props) => {
  const router = useRouter();

  return useMutation({
    mutationFn: ({ code }: TwoFactorFormValues) =>
      unwrapAuthResponse(authClient.twoFactor.verifyTotp({ code })),
    onSuccess: () => router.push("/home"),
    onError: (error: AuthClientError) => {
      if (error.status === RATE_LIMIT_ERROR_CODE) return;

      switch (getAuthErrorCode(error)) {
        case "INVALID_CODE":
          form.setError("code", { message: "Invalid one-time password" });
          return;

        default:
          toast.error("Something went wrong", { description: "Please try again in a moment." });
          return;
      }
    },
  });
};
