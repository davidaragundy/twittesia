import { useRouter } from "next/navigation";
import { use, useOptimistic, useTransition } from "react";
import { toast } from "sonner";

import { authClient } from "@/shared/lib/better-auth/client";

import { useSession } from "@/features/auth/hooks/use-session";
import type { Sessions } from "@/features/settings/types";

interface Props {
  sessions: Promise<Sessions | null>;
}

export const useActiveSessions = ({ sessions: sessionsPromise }: Props) => {
  const router = useRouter();
  const session = useSession();
  const sessions = use(sessionsPromise);
  const [isPending, startTransition] = useTransition();

  // A revoked session leaves the list immediately; the refresh settles the real state
  const [optimisticSessions, removeSession] = useOptimistic(
    sessions ?? [],
    (current, token: string) => current.filter((item) => item.token !== token),
  );

  const revokeSession = (token: string) =>
    startTransition(async () => {
      removeSession(token);

      const { error } = await authClient.revokeSession({ token });

      if (error?.code === "SESSION_NOT_FOUND") {
        toast.info("The session you tried to revoke was already closed 🤓", { duration: 5_000 });
      } else if (error) {
        toast.error("Failed to revoke session, please try again later 😢", { duration: 5_000 });
      }

      startTransition(() => router.refresh());
    });

  const retry = () => startTransition(() => router.refresh());

  return {
    sessions: optimisticSessions,
    isError: sessions === null,
    isPending,
    currentToken: session?.session.token,
    revokeSession,
    retry,
  };
};
