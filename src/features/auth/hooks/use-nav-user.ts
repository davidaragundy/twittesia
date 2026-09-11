import { useRouter } from "next/navigation";
import { useEffect, useEffectEvent, useTransition } from "react";
import { toast } from "sonner";

import { authClient } from "@/shared/lib/better-auth/client";

export const useNavUser = () => {
  const router = useRouter();
  const [isSigningOut, startTransition] = useTransition();

  const handleSignOut = () => {
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

  // Always calls the latest handler without re-subscribing the listener on every render
  const onSignOutShortcut = useEffectEvent(() => handleSignOut());

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!event.metaKey && !event.ctrlKey) return;

      if (event.key === "o") {
        event.preventDefault();
        onSignOutShortcut();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return { handleSignOut, isSigningOut };
};
