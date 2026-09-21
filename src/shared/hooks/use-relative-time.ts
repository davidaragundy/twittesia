import { useSyncExternalStore } from "react";

import { DATE_TIME_FORMAT } from "@/shared/constants/date-time-format";
import { formatRelativeTime } from "@/shared/utils/format-relative-time";
import { minuteClock } from "@/shared/utils/minute-clock";

type Props = {
  date: Date;
};

export const useRelativeTime = ({ date }: Props) => {
  const now = useSyncExternalStore(
    minuteClock.subscribe,
    minuteClock.getSnapshot,
    minuteClock.getServerSnapshot,
  );

  return {
    relative: formatRelativeTime(date, now),
    absolute: DATE_TIME_FORMAT.format(date),
  };
};
