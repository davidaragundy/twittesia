"use client";

import { Button } from "@/shared/components/ui/button";
import { ItemGroup } from "@/shared/components/ui/item";
import { Spinner } from "@/shared/components/ui/spinner";

import { ActiveSessionItem } from "@/features/settings/components/active-session-item";
import { ActiveSessionItemSkeleton } from "@/features/settings/components/active-session-item-skeleton";
import { useActiveSessions } from "@/features/settings/hooks/use-active-sessions";

export const ActiveSessions = () => {
  const {
    sessions,
    isPending,
    isError,
    isRevoking,
    isRetrying,
    currentSessionId,
    revokeSession,
    retry,
  } = useActiveSessions();

  if (isPending) return <ActiveSessionItemSkeleton />;

  if (isError) {
    return (
      <Button type="button" variant="outline" onClick={retry} disabled={isRetrying}>
        {isRetrying && <Spinner data-icon="inline-start" />}
        Retry
      </Button>
    );
  }

  return (
    <ItemGroup>
      {sessions.map((item) => (
        <ActiveSessionItem
          key={item.id}
          session={item}
          isCurrentSession={item.id === currentSessionId}
          onRevoke={() => revokeSession(item.token)}
          disabled={isRevoking}
        />
      ))}
    </ItemGroup>
  );
};
