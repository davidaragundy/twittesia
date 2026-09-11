import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants/rate-limit-error-code";

import { authClient } from "@/features/auth/lib/auth-client";
import type { AuthClientError } from "@/features/auth/types/auth-client-error";
import { unwrapAuthResponse } from "@/features/auth/utils/unwrap-auth-response";
import { ACTIVE_SESSIONS_QUERY_KEY } from "@/features/settings/constants/active-sessions-query-key";
import type { ActiveSession } from "@/features/settings/types/active-session";

export const useRevokeSessionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (token: string) => unwrapAuthResponse(authClient.revokeSession({ token })),
    // The session leaves the list at once and comes back if the request fails
    onMutate: async (token) => {
      await queryClient.cancelQueries({ queryKey: ACTIVE_SESSIONS_QUERY_KEY });

      const previous = queryClient.getQueryData<ActiveSession[]>(ACTIVE_SESSIONS_QUERY_KEY);

      queryClient.setQueryData<ActiveSession[]>(ACTIVE_SESSIONS_QUERY_KEY, (current) =>
        current?.filter((item) => item.token !== token),
      );

      return { previous };
    },
    onError: (error: AuthClientError, _token, context) => {
      queryClient.setQueryData(ACTIVE_SESSIONS_QUERY_KEY, context?.previous);

      if (error.status === RATE_LIMIT_ERROR_CODE) return;

      toast.error("Failed to revoke session, please try again later 😢", { duration: 5_000 });
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ACTIVE_SESSIONS_QUERY_KEY }),
  });
};
