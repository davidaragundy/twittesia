import { useSession } from "@/features/auth/hooks/use-session";
import { useActiveSessionsQuery } from "@/features/settings/hooks/use-active-sessions-query";
import { useRevokeSessionMutation } from "@/features/settings/hooks/use-revoke-session-mutation";

export const useActiveSessions = () => {
  const session = useSession();
  const {
    data: sessions = [],
    isPending,
    isError,
    refetch,
    isRefetching,
  } = useActiveSessionsQuery();
  const { mutate: revokeSession, isPending: isRevoking } = useRevokeSessionMutation();

  return {
    sessions,
    isPending,
    isError,
    isRevoking,
    isRetrying: isRefetching,
    currentSessionId: session?.session.id,
    revokeSession,
    retry: () => refetch(),
  };
};
