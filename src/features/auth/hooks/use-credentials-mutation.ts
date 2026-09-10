import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import type { AuthClientError } from "@/features/auth/types";
import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants";
import { authClient } from "@/shared/lib/better-auth/client";

import type { CredentialsFormValues } from "@/features/auth/types";

interface Props {
  form: UseFormReturn<CredentialsFormValues>;
}

export const useCredentialsMutation = ({ form }: Props) => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (values: CredentialsFormValues) => {
      const { data, error } = await authClient.signIn.email({
        email: values.email,
        password: values.password,
      });

      console.log({ data, error });

      if (error) return Promise.reject(error);

      if ((data as { twoFactorRedirect?: boolean }).twoFactorRedirect)
        return router.push("/two-factor");

      router.push("/home");
    },
    onError: (error: AuthClientError) => {
      if (error.status === RATE_LIMIT_ERROR_CODE) return;

      switch (error.code) {
        case "INVALID_EMAIL_OR_PASSWORD":
          form.setError("email", {
            message: "Invalid email or password.",
          });
          form.setError("password", {
            message: "Invalid email or password.",
          });
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
    },
  });
};
