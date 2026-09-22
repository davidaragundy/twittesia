"use client";

import { useTodayDate } from "@/shared/hooks/use-today-date";

// Today, as the reader's own calendar has it: "Tuesday, September 22". The server and the
// browser read their own clocks, so around midnight the first paint can differ.
export function TodayDate() {
  const { today } = useTodayDate();

  return <time suppressHydrationWarning>{today}</time>;
}
