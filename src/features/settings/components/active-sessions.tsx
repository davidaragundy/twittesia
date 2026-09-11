"use client";

import { Button } from "@/shared/components/ui/button";
import { ItemGroup } from "@/shared/components/ui/item";
import { Spinner } from "@/shared/components/ui/spinner";

import { ActiveSessionItem } from "@/features/settings/components/active-session-item";
import { useActiveSessions } from "@/features/settings/hooks/use-active-sessions";
import type { getSessions } from "@/features/settings/queries/get-sessions";

interface Props {
  sessions: ReturnType<typeof getSessions>;
}

// Suspends until the sessions resolve; the settings dialog shows a skeleton meanwhile
export const ActiveSessions = ({ sessions: sessionsPromise }: Props) => {
  const { sessions, isError, isPending, currentToken, revokeSession, retry } = useActiveSessions({
    sessions: sessionsPromise,
  });

  if (isError) {
    return (
      <Button type="button" variant="outline" onClick={retry} disabled={isPending}>
        {isPending && <Spinner data-icon="inline-start" />}
        Retry
      </Button>
    );
  }

  return (
    <ItemGroup>
      {sessions.map((item) => (
        <ActiveSessionItem
          key={item.token}
          session={item}
          isCurrentSession={item.token === currentToken}
          onRevoke={() => revokeSession(item.token)}
          disabled={isPending}
        />
      ))}
    </ItemGroup>
  );
};
