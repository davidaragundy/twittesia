import { formatMediaTime } from "@/features/media/utils/format-media-time";

interface Props {
  elapsed: number;
  maxSeconds: number;
}

// How long it has been recording, against how long it may
export const RecordingTimer = ({ elapsed, maxSeconds }: Props) => (
  <span className="flex items-center gap-2 rounded-full bg-background/85 px-3 py-1 text-xs font-medium tabular-nums backdrop-blur">
    <span className="size-2 animate-pulse rounded-full bg-destructive" />
    {formatMediaTime({ seconds: elapsed })} / {formatMediaTime({ seconds: maxSeconds })}
  </span>
);
