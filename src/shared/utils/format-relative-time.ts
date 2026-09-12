const UNITS = [
  { unit: "year" as const, ms: 365 * 24 * 60 * 60 * 1_000 },
  { unit: "day" as const, ms: 24 * 60 * 60 * 1_000 },
  { unit: "hour" as const, ms: 60 * 60 * 1_000 },
  { unit: "minute" as const, ms: 60 * 1_000 },
];

const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto", style: "narrow" });

// "3h ago", "now". Render it with suppressHydrationWarning: the server and the browser read
// their own clocks, so the two can land a minute apart.
export const formatRelativeTime = (date: Date) => {
  const elapsed = date.getTime() - Date.now();

  for (const { unit, ms } of UNITS) {
    if (Math.abs(elapsed) >= ms) return formatter.format(Math.round(elapsed / ms), unit);
  }

  return "now";
};
