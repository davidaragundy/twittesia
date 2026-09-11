import { useRouter } from "next/navigation";
import { use, useOptimistic, useTransition } from "react";
import { toast } from "sonner";

import { toastRateLimited } from "@/shared/utils/toast-rate-limited";

import { useSession } from "@/features/auth/hooks/use-session";
import { revokeSession as revokeSessionAction } from "@/features/settings/actions/revoke-session";
import type { getSessions } from "@/features/settings/queries/get-sessions";

interface Props {
  sessions: ReturnType<typeof getSessions>;
}

export const useActiveSessions = ({ sessions: sessionsPromise }: Props) => {
  const router = useRouter();
  const session = useSession();
  const { data: sessions, error } = use(sessionsPromise);
  const [isPending, startTransition] = useTransition();

  // A revoked session leaves the list immediately; the action's refresh settles the real state
  const [optimisticSessions, removeSession] = useOptimistic(
    sessions ?? [],
    (current, sessionId: string) => current.filter((item) => item.id !== sessionId),
  );

  const revokeSession = (sessionId: string) =>
    startTransition(async () => {
      removeSession(sessionId);

      const { error } = await revokeSessionAction(sessionId);

      switch (error?.code) {
        case undefined:
        // Already closed somewhere else: the refreshed list simply no longer has it
        case "SESSION_NOT_FOUND":
          return;

        case "RATE_LIMITED":
          toastRateLimited();
          return;

        default:
          toast.error("Failed to revoke session, please try again later 😢", { duration: 5_000 });
          return;
      }
    });

  // The list failed to load; nothing changed on the server, so refetching the route is enough
  const retry = () => startTransition(() => router.refresh());

  return {
    sessions: optimisticSessions,
    isError: error !== null,
    isPending,
    currentSessionId: session?.session.id,
    revokeSession,
    retry,
  };
};
