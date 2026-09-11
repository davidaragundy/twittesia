import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants/rate-limit-error-code";

import { authClient } from "@/features/auth/lib/auth-client";
import type { SocialProvider } from "@/features/auth/types/social-provider";

interface Props {
  action: "Sign in" | "Sign up";
}

// Signing in and signing up are the same OAuth flow: the provider creates the account if needed
export const useSocialButtons = ({ action }: Props) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const continueWith = (provider: SocialProvider) =>
    startTransition(async () => {
      const { data, error } = await authClient.signIn.social({ provider, callbackURL: "/home" });

      if (error) {
        if (error.status === RATE_LIMIT_ERROR_CODE) return;

        toast.error(`Failed to ${action.toLowerCase()} with ${provider} 😢`);
        return;
      }

      if (data.redirect && data.url) startTransition(() => router.push(data.url as string));
    });

  return { isPending, continueWith };
};
