"use client";

import { Loading03Icon, ArrowReloadHorizontalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { TypographyH4 } from "@/shared/components/typography";
import { Button } from "@/shared/components/ui/button";

import { ActiveSessionCard } from "@/features/settings/components/active-session-card";
import { ActiveSessionCardSkeleton } from "@/features/settings/components/active-session-card-skeleton";
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

  return (
    <div className="flex flex-col gap-4">
      <TypographyH4 className="mb-4 flex items-center gap-2">
        Active sessions {isSessionsSuccess && `(${sessions?.length})`}{" "}
        {isSessionsFetching && (
          <HugeiconsIcon icon={Loading03Icon} className="animate-spin" size={18} />
        )}
      </TypographyH4>

      {isSessionsLoading && <ActiveSessionCardSkeleton />}

      {isSessionsError && (
        <Button variant="outline" type="button" onClick={() => refetchSessions()}>
          Retry
          {isSessionsRefetching ? (
            <HugeiconsIcon icon={Loading03Icon} className="animate-spin" />
          ) : (
            <HugeiconsIcon icon={ArrowReloadHorizontalIcon} />
          )}
        </Button>
      )}

      {isSessionsSuccess &&
        sessions!.map((sessionData) => (
          <ActiveSessionCard
            key={sessionData.token}
            session={sessionData}
            isCurrentSession={session?.session.token === sessionData.token}
            isSessionsFetching={isSessionsFetching}
          />
        ))}
    </div>
  );
};
