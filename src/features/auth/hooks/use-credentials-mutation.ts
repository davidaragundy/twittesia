import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants";
import { authClient } from "@/shared/lib/better-auth/client";

import type { AuthClientError, CredentialsFormValues } from "@/features/auth/types";

interface Props {
  form: UseFormReturn<CredentialsFormValues>;
}

export const useCredentialsMutation = ({ form }: Props) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleError = (error: AuthClientError) => {
    if (error.status === RATE_LIMIT_ERROR_CODE) return;

    switch (error.code) {
      case "INVALID_EMAIL_OR_PASSWORD":
        form.setError("email", { message: "Invalid email or password." });
        form.setError("password", { message: "Invalid email or password." });
        return;

      case "EMAIL_NOT_VERIFIED":
        toast.error("Verify your email to sign in", {
          description: "Check your inbox (or spam folder) for the verification email 📧",
          duration: 10000,
        });
        return;

      default:
        toast.error("Something went wrong, please try again later 😢");
        return;
    }
  };

  const mutate = (values: CredentialsFormValues) =>
    startTransition(async () => {
      const { data, error } = await authClient.signIn.email({
        email: values.email,
        password: values.password,
      });

      if (error) return handleError(error);

      startTransition(() =>
        router.push(
          (data as { twoFactorRedirect?: boolean }).twoFactorRedirect ? "/two-factor" : "/home",
        ),
      );
    });

  return { mutate, isPending };
};
