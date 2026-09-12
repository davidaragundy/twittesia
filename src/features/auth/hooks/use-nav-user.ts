import { useEffect, useEffectEvent } from "react";

import { useSession } from "@/features/auth/hooks/use-session";
import { writeLeaveOpen } from "@/features/auth/utils/write-leave-open";

export const useNavUser = () => {
  const session = useSession();

  // Always calls the latest handler without re-subscribing the listener on every render
  const onLeaveShortcut = useEffectEvent(() => writeLeaveOpen(true));

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!event.metaKey && !event.ctrlKey) return;

      if (event.key === "o") {
        event.preventDefault();
        onLeaveShortcut();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  // The shortcut and the menu item both open the confirmation; neither leaves on its own
  return { user: session?.user, openLeave: () => writeLeaveOpen(true) };
};
