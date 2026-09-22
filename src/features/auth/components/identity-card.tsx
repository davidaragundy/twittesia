"use client";

import { LifespanRing } from "@/shared/components/lifespan-ring";
import { SeededAvatar } from "@/shared/components/seeded-avatar";

import { IdentityTimeLeft } from "@/features/auth/components/identity-time-left";
import { useIdentityCard } from "@/features/auth/hooks/use-identity-card";

// Who you are here, and how much of your day is left, beside the feed on a wide screen
export function IdentityCard() {
  const { user, startsAt, endsAt } = useIdentityCard();

  if (!user) return null;

  return (
    <section aria-label="Your identity" className="flex flex-col gap-5 rounded-3xl bg-muted/30 p-5">
      <div className="flex items-center gap-3">
        <SeededAvatar seed={user.username} size="lg" />
        <div className="flex min-w-0 flex-col">
          <p className="truncate font-semibold">{user.name}</p>
          <p className="truncate handle text-sm text-muted-foreground">@{user.displayUsername}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <LifespanRing startsAt={startsAt} endsAt={endsAt} size={40} />
        <IdentityTimeLeft startsAt={startsAt} endsAt={endsAt} />
      </div>
    </section>
  );
}
