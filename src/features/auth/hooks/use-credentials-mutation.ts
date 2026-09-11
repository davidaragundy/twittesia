import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { authClient } from "@/features/auth/lib/auth-client";
import type { AuthClientError } from "@/features/auth/types/auth-client-error";
import type { CredentialsFormValues } from "@/features/auth/types/credentials-form-values";
import { handleAuthError } from "@/features/auth/utils/handle-auth-error";
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
      handleAuthError(error, {
        INVALID_EMAIL_OR_PASSWORD: () => {
          form.setError("email", { message: "Invalid email or password." });
          form.setError("password", { message: "Invalid email or password." });
        },
        EMAIL_NOT_VERIFIED: () => {
          toast.error("Verify your email to sign in", {
            description: "Check your inbox, or your spam folder, for the verification email.",
          });
        },
        fallback: () => {
          toast.error("Something went wrong", { description: "Please try again in a moment." });
        },
      });
    },
  });
};
