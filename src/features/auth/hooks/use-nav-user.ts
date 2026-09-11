import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { authClient } from "@/shared/lib/better-auth/client";

export const useNavUser = () => {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = useCallback(
    async (event?: Event) => {
      event?.preventDefault();

      if (isSigningOut) return;

      setIsSigningOut(true);

      const { error } = await authClient.signOut();

      if (error) {
        setIsSigningOut(false);
        toast.error("Failed to sign out. Please try again later.");
        return;
      }

      router.push("/sign-in");
    },
    [isSigningOut, router],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!event.metaKey && !event.ctrlKey) return;

      if (event.key === "o") {
        event.preventDefault();
        handleSignOut();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [handleSignOut]);

  return {
    handleSignOut,
    isSigningOut,
  };
};
