import { useSyncExternalStore } from "react";

import { minuteClock } from "@/shared/utils/minute-clock";
import { toTimeLeft } from "@/shared/utils/to-time-left";

type Props = {
  startsAt: Date;
  endsAt: Date;
};

// How much of something's life is left, on the same minute clock as every relative time
export const useLifespan = ({ startsAt, endsAt }: Props) => {
  const now = useSyncExternalStore(
    minuteClock.subscribe,
    minuteClock.getSnapshot,
    minuteClock.getServerSnapshot,
  );
  const total = endsAt.getTime() - startsAt.getTime();
  const remaining = Math.min(Math.max((endsAt.getTime() - now) / total, 0), 1);

  return {
    remaining,
    timeLeft: toTimeLeft({ expiresAt: endsAt, now }),
    // The last hour is the one worth noticing
    isEnding: endsAt.getTime() - now < 60 * 60 * 1000,
  };
};
