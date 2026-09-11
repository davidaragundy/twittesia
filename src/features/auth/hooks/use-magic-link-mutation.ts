import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { authClient } from "@/features/auth/lib/auth-client";
import type { AuthClientError } from "@/features/auth/types/auth-client-error";
import type { MagicLinkFormValues } from "@/features/auth/types/magic-link-form-values";
import { handleAuthError } from "@/features/auth/utils/handle-auth-error";
import { unwrapAuthResponse } from "@/features/auth/utils/unwrap-auth-response";

export const useMagicLinkMutation = () =>
  useMutation({
    mutationFn: ({ email }: MagicLinkFormValues) =>
      unwrapAuthResponse(authClient.signIn.magicLink({ email, callbackURL: "/home" })),
    onSuccess: () => {
      toast.success("Magic link sent", {
        description: "Check your inbox, or your spam folder, for the link.",
      });
    },
    onError: (error: AuthClientError) => {
      handleAuthError(error, {
        FAILED_TO_SEND_MAGIC_LINK: () => {
          toast.error("Couldn't send the magic link", {
            description: "Try again in a moment, or sign in another way.",
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
