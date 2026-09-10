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
    isSessionsSuccess,
    isSessionsLoading,
    isSessionsFetching,
    isSessionsError,
    refetchSessions,
    isSessionsRefetching,
    session,
  } = useActiveSessions();

  if (isSessionsError) {
    return (
      <Button type="button" variant="outline" onClick={() => refetchSessions()}>
        {isSessionsRefetching && <Spinner data-icon="inline-start" />}
        Retry
      </Button>
    );
  }

  return (
    <ItemGroup>
      {isSessionsLoading && <ActiveSessionItemSkeleton />}
      {isSessionsSuccess &&
        sessions?.map((sessionData) => (
          <ActiveSessionItem
            key={sessionData.token}
            session={sessionData}
            isCurrentSession={session?.session.token === sessionData.token}
            isSessionsFetching={isSessionsFetching}
          />
        ))}
    </ItemGroup>
  );
};
