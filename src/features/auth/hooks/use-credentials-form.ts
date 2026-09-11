import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants/rate-limit-error-code";

import { authClient } from "@/features/auth/lib/auth-client";
import { credentialsFormSchema } from "@/features/auth/schemas/credentials-form-schema";
import type { AuthClientError } from "@/features/auth/types/auth-client-error";
import type { CredentialsFormValues } from "@/features/auth/types/credentials-form-values";
import { getAuthErrorCode } from "@/features/auth/utils/get-auth-error-code";

export const useCredentialsForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<CredentialsFormValues>({
    resolver: zodResolver(credentialsFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleError = (error: AuthClientError) => {
    if (error.status === RATE_LIMIT_ERROR_CODE) return;

    switch (getAuthErrorCode(error)) {
      case "INVALID_EMAIL_OR_PASSWORD":
        form.setError("email", { message: "Invalid email or password." });
        form.setError("password", { message: "Invalid email or password." });
        return;

      case "EMAIL_NOT_VERIFIED":
        toast.error("Verify your email to sign in", {
          description: "Check your inbox (or spam folder) for the verification email 📧",
          duration: 10_000,
        });
        return;

      default:
        toast.error("Something went wrong, please try again later 😢");
        return;
    }
  };

  const onSubmit = ({ email, password }: CredentialsFormValues) =>
    startTransition(async () => {
      const { data, error } = await authClient.signIn.email({ email, password });

      if (error) return handleError(error);

      const needsTwoFactor = "twoFactorRedirect" in data && data.twoFactorRedirect;

      startTransition(() => router.push(needsTwoFactor ? "/two-factor" : "/home"));
    });

  return { form, onSubmit, isPending };
};
