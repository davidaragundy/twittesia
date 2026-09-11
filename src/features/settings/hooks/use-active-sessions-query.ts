import { useQuery } from "@tanstack/react-query";

import { authClient } from "@/features/auth/lib/auth-client";
import { unwrapAuthResponse } from "@/features/auth/utils/unwrap-auth-response";
import { ACTIVE_SESSIONS_QUERY_KEY } from "@/features/settings/constants/active-sessions-query-key";

// Loaded in the browser when the security tab opens, not on every page render
export const useActiveSessionsQuery = () =>
  useQuery({
    queryKey: ACTIVE_SESSIONS_QUERY_KEY,
    queryFn: () => unwrapAuthResponse(authClient.listSessions()),
  });
