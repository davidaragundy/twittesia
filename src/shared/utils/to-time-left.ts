interface Props {
  expiresAt: Date;
  now: number;
}

// How long something has left, to the minute: "23h 04m", "12m", or nothing once it has ended
export const toTimeLeft = ({ expiresAt, now }: Props) => {
  const left = expiresAt.getTime() - now;

  if (left <= 0) return null;

  const minutes = Math.floor(left / 60_000) % 60;
  const hours = Math.floor(left / 3_600_000);

  return hours ? `${hours}h ${String(minutes).padStart(2, "0")}m` : `${minutes}m`;
};
