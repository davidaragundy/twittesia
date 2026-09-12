import { useEffect, useEffectEvent } from "react";

import { useLeave } from "@/features/auth/hooks/use-leave";
import { useSession } from "@/features/auth/hooks/use-session";

export const useNavUser = () => {
  const session = useSession();
  const { leave, isLeaving } = useLeave();

  // Always calls the latest handler without re-subscribing the listener on every render
  const onLeaveShortcut = useEffectEvent(() => leave());

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

  return { user: session?.user, leave, isLeaving };
};
