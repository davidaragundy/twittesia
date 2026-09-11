import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants/rate-limit-error-code";

import { authClient } from "@/features/auth/lib/auth-client";
import type { AuthClientError } from "@/features/auth/types/auth-client-error";
import type { CredentialsFormValues } from "@/features/auth/types/credentials-form-values";
import { getAuthErrorCode } from "@/features/auth/utils/get-auth-error-code";
import { unwrapAuthResponse } from "@/features/auth/utils/unwrap-auth-response";

interface Props {
  form: UseFormReturn<CredentialsFormValues>;
}

export const useCredentialsMutation = ({ form }: Props) => {
  const router = useRouter();

  return useMutation({
    mutationFn: ({ email, password }: CredentialsFormValues) =>
      unwrapAuthResponse(authClient.signIn.email({ email, password })),
    onSuccess: (data) => {
      const needsTwoFactor = "twoFactorRedirect" in data && data.twoFactorRedirect;

      router.push(needsTwoFactor ? "/two-factor" : "/home");
    },
    onError: (error: AuthClientError) => {
      if (error.status === RATE_LIMIT_ERROR_CODE) return;

      switch (getAuthErrorCode(error)) {
        case "INVALID_EMAIL_OR_PASSWORD":
          form.setError("email", { message: "Invalid email or password." });
          form.setError("password", { message: "Invalid email or password." });
          return;

        case "EMAIL_NOT_VERIFIED":
          toast.error("Verify your email to sign in", {
            description: "Check your inbox, or your spam folder, for the verification email.",
          });
          return;

        default:
          toast.error("Something went wrong", { description: "Please try again in a moment." });
          return;
      }
    },
  });
};
