"use client";

import {
  MusicNote03Icon,
  PauseIcon,
  PlayIcon,
  VolumeHighIcon,
  VolumeMute02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "cn";

import { Button } from "@/shared/components/ui/button";

import { MediaSeekBar } from "@/features/media/components/media-seek-bar";
import { useMediaPlayback } from "@/features/media/hooks/use-media-playback";
import type { Media } from "@/features/media/types/media";

interface Props {
  media: Media;
  className?: string;
}

// Only the header loads until someone presses play, enough to know how long it is while sparing
// the plan's monthly transfer
export const MediaAudio = ({ media, className }: Props) => {
  const { mediaRef, isPlaying, isMuted, currentTime, duration, togglePlay, seek, toggleMute } =
    useMediaPlayback<HTMLAudioElement>();

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-3xl bg-muted/60 p-2 pr-3 ring-1 ring-foreground/5",
        className,
      )}
    >
      <audio ref={mediaRef} src={media.url} preload="metadata" aria-label="Attached audio" />

      <Button
        type="button"
        size="icon"
        onClick={togglePlay}
        aria-label={isPlaying ? "Pause" : "Play"}
        className="size-10 shrink-0"
      >
        <HugeiconsIcon icon={isPlaying ? PauseIcon : PlayIcon} className="size-4" />
      </Button>

      <HugeiconsIcon
        icon={MusicNote03Icon}
        className="hidden size-4 shrink-0 text-muted-foreground sm:block"
      />

      <MediaSeekBar currentTime={currentTime} duration={duration} onSeek={seek} />

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={toggleMute}
        aria-label={isMuted ? "Unmute" : "Mute"}
        className="shrink-0"
      >
        <HugeiconsIcon icon={isMuted ? VolumeMute02Icon : VolumeHighIcon} className="size-4" />
      </Button>
    </div>
  );
};
