import { useTransition } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants";
import { authClient } from "@/shared/lib/better-auth/client";

import type { AuthClientError, MagicLinkFormValues } from "@/features/auth/types";

interface Props {
  form: UseFormReturn<MagicLinkFormValues>;
}

export const useMagicLinkMutation = ({ form }: Props) => {
  const [isPending, startTransition] = useTransition();

  const handleError = (error: AuthClientError) => {
    if (error.status === RATE_LIMIT_ERROR_CODE) return;

    switch (error.code) {
      case "USER_NOT_FOUND":
        form.setError("email", {
          message: "Please check your email address or sign up if you don't have an account.",
        });
        return;

      case "FAILED_TO_SEND_MAGIC_LINK":
        toast.error("Failed to send magic link 😢", {
          duration: 10_000,
          description: "Try again later or use another method to sign in.",
        });
        return;

      default:
        toast.error("Something went wrong 😢", {
          description: "Please try again later",
          duration: 10_000,
        });
        return;
    }
  };

  const mutate = (values: MagicLinkFormValues) =>
    startTransition(async () => {
      const { error } = await authClient.signIn.magicLink({
        email: values.email,
        callbackURL: "/home",
      });

      if (error) return handleError(error);

      toast.success("Magic link sent successfully 🎉", {
        description: "Check your inbox (or spam folder) for the link.",
        duration: 10_000,
      });
    });

  return { mutate, isPending };
};
