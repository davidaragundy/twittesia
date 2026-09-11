import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants";
import { authClient } from "@/shared/lib/better-auth/client";

type Provider = "google" | "github";

export const useSignInSocialMutation = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const mutate = ({ provider }: { provider: Provider }) =>
    startTransition(async () => {
      const { data, error } = await authClient.signIn.social({ provider, callbackURL: "/home" });

      if (error) {
        if (error.status === RATE_LIMIT_ERROR_CODE) return;

        toast.error(`Failed to sign in with ${provider} 😢`);
        return;
      }

      if (data?.redirect) startTransition(() => router.push(data.url as string));
    });

  return { mutate, isPending };
};
