import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

import { WELCOME_PARAM } from "@/features/auth/constants/welcome-param";
import { useSession } from "@/features/auth/hooks/use-session";

// Suspends until the session resolves: render it below a <Suspense> boundary
export const useWelcomeToast = () => {
  const searchParams = useSearchParams();
  const session = useSession();
  const isWelcome = searchParams.has(WELCOME_PARAM);
  const name = session?.user.name;

  useEffect(() => {
    if (!isWelcome || !name) return;

    // An id, so an effect that runs twice still says it once
    toast(`You're ${name}`, {
      id: "welcome",
      // Long enough to read on arrival, while the rest of the page is still settling in
      duration: 8000,
      description: "This identity lasts 24 hours, and everything you write goes with it.",
    });

    // Said once: a reload or a shared link doesn't say it again
    const url = new URL(window.location.href);

    url.searchParams.delete(WELCOME_PARAM);
    window.history.replaceState(null, "", url);
  }, [isWelcome, name]);
};
