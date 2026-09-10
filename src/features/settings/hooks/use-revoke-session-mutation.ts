import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { authClient } from "@/shared/lib/better-auth/client";

import type { AuthClientError, Session } from "@/features/auth/types";
import { SESSIONS_QUERY_KEY } from "@/features/settings/lib/react-query/query-keys";

export const useRevokeSessionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (token: string) => {
      const { error } = await authClient.revokeSession({
        token,
      });

      if (error) return Promise.reject(error);
    },
    onMutate: async (token) => {
      await queryClient.cancelQueries({ queryKey: [SESSIONS_QUERY_KEY] });

      const previousSessions = queryClient.getQueryData<Session["session"][]>([SESSIONS_QUERY_KEY]);

      queryClient.setQueryData([SESSIONS_QUERY_KEY], (old: Session["session"][]) =>
        old.filter((session) => session.token !== token),
      );

      return { previousSessions };
    },
    onError: (error: AuthClientError, _token, context) => {
      queryClient.setQueryData([SESSIONS_QUERY_KEY], context?.previousSessions);

      switch (error.code) {
        case "SESSION_NOT_FOUND":
          toast.info("The session you tried to revoke was already closed 🤓", {
            duration: 5_000,
          });
          return;

        default:
          toast.error("Failed to revoke session, please try again later 😢", {
            duration: 5_000,
          });
          return;
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [SESSIONS_QUERY_KEY] });
    },
  });
};
