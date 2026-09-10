import { UseFormReturn } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import type { AuthClientError } from "@/features/auth/types";
import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants";
import { authClient } from "@/shared/lib/better-auth/client";

import { getHash } from "@/features/auth/utils/get-hash";
import type { SignUpFormValues } from "@/features/auth/types";

interface Props {
  form: UseFormReturn<SignUpFormValues>;
}

export const useSignUpEmailMutation = ({ form }: Props) => {
  return useMutation({
    mutationFn: async (values: SignUpFormValues) => {
      const hash = await getHash(values.email);
      const image = `https://gravatar.com/avatar/${hash}?size=500&d=robohash&r=x`;

      const { data, error } = await authClient.signUp.email({
        email: values.email,
        password: values.password,
        name: values.name,
        username: values.username,
        displayUsername: values.username,
        image,
        callbackURL: "/home",
      });

      console.log("Client response", { data, error });

      if (error) return Promise.reject(error);

      return data;
    },
    onSuccess: () => {
      toast.success("Account created successfully 🎉", {
        description: "Check your inbox (or spam folder) for the verification email.",
        duration: 10_000,
      });

      form.reset();
    },
    onError: (error: AuthClientError, values) => {
      console.log("Client error", { error });
      if (error.status === RATE_LIMIT_ERROR_CODE) return;

      switch (error.code) {
        case "USERNAME_IS_ALREADY_TAKEN":
          form.setError("username", {
            message: "Username is already taken. Please try another.",
          });
          return;

        case "PASSWORD_COMPROMISED":
          form.setError("password", {
            message: "Password is compromised. Please choose a more secure password.",
          });
          return;

        case "FAILED_TO_SEND_VERIFICATION_EMAIL":
          const toastId = toast.error("Failed to send verification email 😢", {
            duration: 10_000,
            action: {
              label: "Resend email",
              onClick: async () => {
                const id = toast.loading("Resending email...");

                const { error } = await authClient.sendVerificationEmail({
                  email: values.email,
                  callbackURL: "/home",
                });

                if (error) {
                  if (error.status === 429) return;

                  toast.dismiss(id);
                  toast.error("Failed to resend email 😢", {
                    id: toastId,
                    duration: 10_000,
                  });
                  return;
                }

                toast.success("Email sent successfully 🎉", {
                  id,
                  description: "Check your inbox (or spam folder) for the verification email.",
                  duration: 10_000,
                });
              },
            },
          });
          return;

        default:
          toast.error("Something went wrong 😢", {
            description: "Please try again later",
            duration: 10_000,
          });
          return;
      }
    },
  });
};
