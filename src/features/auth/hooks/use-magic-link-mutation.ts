import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants/rate-limit-error-code";

import { authClient } from "@/features/auth/lib/auth-client";
import type { AuthClientError } from "@/features/auth/types/auth-client-error";
import type { MagicLinkFormValues } from "@/features/auth/types/magic-link-form-values";
import { getAuthErrorCode } from "@/features/auth/utils/get-auth-error-code";
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
      if (error.status === RATE_LIMIT_ERROR_CODE) return;

      switch (getAuthErrorCode(error)) {
        case "FAILED_TO_SEND_MAGIC_LINK":
          toast.error("Couldn't send the magic link", {
            description: "Try again in a moment, or sign in another way.",
          });
          return;

        default:
          toast.error("Something went wrong", {
            description: "Please try again in a moment.",
          });
          return;
      }
    },
  });
