import { useTransition } from "react";
import { toast } from "sonner";

import { signOut as signOutAction } from "@/features/auth/actions/sign-out";

export const useSignOut = () => {
  const [isSigningOut, startTransition] = useTransition();

  // On success the action redirects to /sign-in, so only a failure comes back
  const signOut = () => {
    if (isSigningOut) return;

    startTransition(async () => {
      const { error } = await signOutAction();

      if (error) toast.error("Failed to sign out. Please try again later.");
    });
  };

  return { signOut, isSigningOut };
};
