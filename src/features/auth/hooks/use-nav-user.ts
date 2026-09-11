import { useEffect, useEffectEvent } from "react";

import { useSession } from "@/features/auth/hooks/use-session";
import { useSignOut } from "@/features/auth/hooks/use-sign-out";

export const useNavUser = () => {
  const session = useSession();
  const { signOut, isSigningOut } = useSignOut();

  // Always calls the latest handler without re-subscribing the listener on every render
  const onSignOutShortcut = useEffectEvent(() => signOut());

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

  return { user: session?.user, signOut, isSigningOut };
};
