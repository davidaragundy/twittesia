const UNITS = [
  { unit: "year" as const, ms: 365 * 24 * 60 * 60 * 1_000 },
  { unit: "day" as const, ms: 24 * 60 * 60 * 1_000 },
  { unit: "hour" as const, ms: 60 * 60 * 1_000 },
  { unit: "minute" as const, ms: 60 * 1_000 },
];

const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto", style: "narrow" });

// "3h ago", "now", measured from `now`
export const formatRelativeTime = (date: Date, now: number) => {
  const elapsed = date.getTime() - now;

  for (const { unit, ms } of UNITS) {
    if (Math.abs(elapsed) >= ms) return formatter.format(Math.round(elapsed / ms), unit);
  }

  return "now";
};
