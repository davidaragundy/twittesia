import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { authClient } from "@/features/auth/lib/auth-client";
import type { AuthClientError } from "@/features/auth/types/auth-client-error";
import type { SocialProvider } from "@/features/auth/types/social-provider";
import { handleAuthError } from "@/features/auth/utils/handle-auth-error";
import { unwrapAuthResponse } from "@/features/auth/utils/unwrap-auth-response";

interface Props {
  action: "Sign in" | "Sign up";
}

// Signing in and signing up are the same OAuth flow: the provider creates the account if needed
export const useSocialSignInMutation = ({ action }: Props) => {
  const router = useRouter();

  return useMutation({
    mutationFn: (provider: SocialProvider) =>
      unwrapAuthResponse(authClient.signIn.social({ provider, callbackURL: "/home" })),
    onSuccess: (data) => {
      if (data.redirect && data.url) router.push(data.url);
    },
    onError: (error: AuthClientError, provider) => {
      handleAuthError(error, {
        fallback: () => {
          toast.error(
            `Couldn't ${action.toLowerCase()} with ${provider === "github" ? "GitHub" : "Google"}`,
            {
              description: "Please try again in a moment.",
            },
          );
        },
      });
    },
  });
};
