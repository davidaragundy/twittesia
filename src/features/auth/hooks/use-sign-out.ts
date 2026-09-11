import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { authClient } from "@/features/auth/lib/auth-client";

export const useSignOut = () => {
  const router = useRouter();
  const [isSigningOut, startTransition] = useTransition();

  const signOut = () => {
    if (isSigningOut) return;

    startTransition(async () => {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error("Failed to sign out. Please try again later.");
        return;
      }

      startTransition(() => router.push("/sign-in"));
    });
  };

  return { signOut, isSigningOut };
};
