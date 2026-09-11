import { useMutation } from "@tanstack/react-query";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { tryCatch } from "@/shared/utils/try-catch";

import { authClient } from "@/features/auth/lib/auth-client";
import type { AuthClientError } from "@/features/auth/types/auth-client-error";
import type { SignUpFormValues } from "@/features/auth/types/sign-up-form-values";
import { getHash } from "@/features/auth/utils/get-hash";
import { handleAuthError } from "@/features/auth/utils/handle-auth-error";
import { unwrapAuthResponse } from "@/features/auth/utils/unwrap-auth-response";

interface Props {
  form: UseFormReturn<SignUpFormValues>;
}

const resendVerificationEmail = async (email: string, failedToastId: string | number) => {
  const id = toast.loading("Resending the verification email…");

  const { error } = await authClient.sendVerificationEmail({ email, callbackURL: "/home" });

  if (error) {
    toast.dismiss(id);
    handleAuthError(error, {
      fallback: () => toast.error("Couldn't resend the email", { id: failedToastId }),
    });
    return;
  }

  toast.success("Verification email sent", {
    id,
    description: "Check your inbox, or your spam folder, for the verification email.",
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
      toast.success("Account created", {
        description: "Check your inbox, or your spam folder, for the verification email.",
      });

      form.reset();
    },
    onError: (error: AuthClientError, values) => {
      handleAuthError(error, {
        USERNAME_IS_ALREADY_TAKEN: () => {
          form.setError("username", { message: "Username is already taken. Please try another." });
        },
        PASSWORD_COMPROMISED: () => {
          form.setError("password", {
            message: "Password is compromised. Please choose a more secure password.",
          });
        },
        FAILED_TO_SEND_VERIFICATION_EMAIL: () => {
          const toastId = toast.error("Couldn't send the verification email", {
            action: {
              label: "Resend email",
              onClick: () => resendVerificationEmail(values.email, toastId),
            },
          });
        },
        fallback: () => {
          toast.error("Something went wrong", {
            description: "Please try again in a moment.",
          });
        },
      });
    },
  });
