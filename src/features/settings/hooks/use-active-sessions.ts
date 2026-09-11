import { useRouter } from "next/navigation";
import { use, useOptimistic, useTransition } from "react";
import { toast } from "sonner";

import { useSession } from "@/features/auth/hooks/use-session";
import { authClient } from "@/features/auth/lib/auth-client";
import type { getSessions } from "@/features/settings/queries/get-sessions";

interface Props {
  sessions: ReturnType<typeof getSessions>;
}

export const useActiveSessions = ({ sessions: sessionsPromise }: Props) => {
  const router = useRouter();
  const session = useSession();
  const { data: sessions, error } = use(sessionsPromise);
  const [isPending, startTransition] = useTransition();

  // A revoked session leaves the list immediately; the refresh settles the real state
  const [optimisticSessions, removeSession] = useOptimistic(
    sessions ?? [],
    (current, token: string) => current.filter((item) => item.token !== token),
  );

  const revokeSession = (token: string) =>
    startTransition(async () => {
      removeSession(token);

      // Revoking a session that is already gone succeeds too, so any error here is unexpected
      const { error } = await authClient.revokeSession({ token });

      if (error) {
        toast.error("Failed to revoke session, please try again later 😢", { duration: 5_000 });
      }

      startTransition(() => router.refresh());
    });

  const retry = () => startTransition(() => router.refresh());

  return {
    sessions: optimisticSessions,
    isError: error !== null,
    isPending,
    currentToken: session?.session.token,
    revokeSession,
    retry,
  };
};
