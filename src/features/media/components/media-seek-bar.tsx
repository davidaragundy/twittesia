"use client";

import { Slider } from "@/shared/components/ui/slider";

import { formatMediaTime } from "@/features/media/utils/format-media-time";

interface Props {
  currentTime: number;
  duration: number;
  onSeek: (seconds: number) => void;
}

// How far into the clip, and how long it is, around a bar that jumps to any point in it
export const MediaSeekBar = ({ currentTime, duration, onSeek }: Props) => (
  <div className="flex min-w-0 flex-1 items-center gap-3 text-xs font-medium tabular-nums">
    <span className="shrink-0">{formatMediaTime({ seconds: currentTime })}</span>
    <Slider
      aria-label="Seek"
      value={[Math.min(currentTime, duration)]}
      min={0}
      max={duration || 1}
      step={0.1}
      disabled={!duration}
      onValueChange={(value) => onSeek(Array.isArray(value) ? (value[0] ?? 0) : value)}
      className="min-w-0 flex-1 **:data-[slot=slider-thumb]:size-3.5 **:data-[slot=slider-track]:h-1"
    />
    <span className="shrink-0 opacity-70">{formatMediaTime({ seconds: duration })}</span>
  </div>
);
