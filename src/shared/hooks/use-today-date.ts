import { useSyncExternalStore } from "react";

import { minuteClock } from "@/shared/utils/minute-clock";

const format = new Intl.DateTimeFormat("en", { weekday: "long", month: "long", day: "numeric" });

export const useTodayDate = () => {
  const now = useSyncExternalStore(
    minuteClock.subscribe,
    minuteClock.getSnapshot,
    minuteClock.getServerSnapshot,
  );

  return { today: format.format(now) };
};
