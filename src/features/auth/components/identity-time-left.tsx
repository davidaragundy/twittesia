"use client";

import { useLifespan } from "@/shared/hooks/use-lifespan";

type Props = {
  startsAt: Date;
  endsAt: Date;
};

// How long an identity has left, spelled out. The server and the browser read their own clocks,
// so the first paint can differ by a moment.
export function IdentityTimeLeft({ startsAt, endsAt }: Props) {
  const { timeLeft } = useLifespan({ startsAt, endsAt });

  return (
    <div className="flex flex-col">
      <p className="font-medium tabular-nums" suppressHydrationWarning>
        {timeLeft ? `${timeLeft} left` : "Ending now"}
      </p>
      <p className="text-sm text-muted-foreground">of your 24 hours</p>
    </div>
  );
}
