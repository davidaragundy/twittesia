import { useMutation } from "@tanstack/react-query";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants/rate-limit-error-code";
import { tryCatch } from "@/shared/utils/try-catch";

import { authClient } from "@/features/auth/lib/auth-client";
import type { AuthClientError } from "@/features/auth/types/auth-client-error";
import type { SignUpFormValues } from "@/features/auth/types/sign-up-form-values";
import { getAuthErrorCode } from "@/features/auth/utils/get-auth-error-code";
import { getHash } from "@/features/auth/utils/get-hash";
import { unwrapAuthResponse } from "@/features/auth/utils/unwrap-auth-response";

interface Props {
  form: UseFormReturn<SignUpFormValues>;
}

const resendVerificationEmail = async (email: string, failedToastId: string | number) => {
  const id = toast.loading("Resending email...");

  const { error } = await authClient.sendVerificationEmail({ email, callbackURL: "/home" });

  if (error) {
    toast.dismiss(id);
    if (error.status === RATE_LIMIT_ERROR_CODE) return;

    toast.error("Failed to resend email 😢", { id: failedToastId, duration: 10_000 });
    return;
  }

  toast.success("Email sent successfully 🎉", {
    id,
    description: "Check your inbox (or spam folder) for the verification email.",
    duration: 10_000,
  });
};

export const useSignUpEmailMutation = ({ form }: Props) =>
  useMutation({
    mutationFn: async (values: SignUpFormValues) => {
      // Hashing needs a secure context; without one the account simply starts without an avatar
      const { data: hash } = await tryCatch(getHash(values.email));

      return unwrapAuthResponse(
        authClient.signUp.email({
          email: values.email,
          password: values.password,
          name: values.name,
          username: values.username,
          displayUsername: values.username,
          image: hash ? `https://gravatar.com/avatar/${hash}?size=500&d=robohash&r=x` : undefined,
          callbackURL: "/home",
        }),
      );
    },
    onSuccess: () => {
      toast.success("Account created successfully 🎉", {
        description: "Check your inbox (or spam folder) for the verification email.",
        duration: 10_000,
      });

      form.reset();
    },
    onError: (error: AuthClientError, values) => {
      if (error.status === RATE_LIMIT_ERROR_CODE) return;

      switch (getAuthErrorCode(error)) {
        case "USERNAME_IS_ALREADY_TAKEN":
          form.setError("username", { message: "Username is already taken. Please try another." });
          return;

        case "PASSWORD_COMPROMISED":
          form.setError("password", {
            message: "Password is compromised. Please choose a more secure password.",
          });
          return;

        case "FAILED_TO_SEND_VERIFICATION_EMAIL": {
          const toastId = toast.error("Failed to send verification email 😢", {
            duration: 10_000,
            action: {
              label: "Resend email",
              onClick: () => resendVerificationEmail(values.email, toastId),
            },
          });
          return;
        }

        default:
          toast.error("Something went wrong 😢", {
            description: "Please try again later",
            duration: 10_000,
          });
          return;
      }
    },
  });
