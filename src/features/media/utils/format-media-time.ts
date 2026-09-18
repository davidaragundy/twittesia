interface Props {
  seconds: number;
}

// "0:07", "1:42", "12:05": how far into a clip, the way every player shows it
export const formatMediaTime = ({ seconds }: Props) => {
  const whole = Number.isFinite(seconds) ? Math.max(Math.floor(seconds), 0) : 0;

  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
};
