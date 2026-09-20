"use client";

import {
  FullScreenIcon,
  PauseIcon,
  PlayIcon,
  VolumeHighIcon,
  VolumeMute02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "cn";

import { MediaSeekBar } from "@/features/media/components/media-seek-bar";
import { useMediaVideo } from "@/features/media/hooks/use-media-video";
import type { Media } from "@/features/media/types/media";
import { getMediaAspectRatio } from "@/features/media/utils/get-media-aspect-ratio";

interface Props {
  media: Media;
  // The shape to draw it in, when it must match something else's; its own otherwise
  aspectRatio?: number;
  className?: string;
}

// Only the first frame and the duration load until someone presses play, to spare the plan's
// monthly transfer. The controls step aside while it plays, and come back on hover or focus.
export const MediaVideo = ({ media, aspectRatio, className }: Props) => {
  const {
    mediaRef,
    containerRef,
    isPlaying,
    isMuted,
    currentTime,
    duration,
    togglePlay,
    seek,
    toggleMute,
    enterFullscreen,
  } = useMediaVideo();

  return (
    <div
      ref={containerRef}
      className={cn(
        "group/video relative aspect-(--media-aspect) overflow-hidden rounded-3xl bg-black ring-1 ring-foreground/5",
        className,
      )}
      style={{ "--media-aspect": aspectRatio ?? getMediaAspectRatio(media) } as React.CSSProperties}
    >
      <video
        ref={mediaRef}
        src={media.url}
        playsInline
        preload="metadata"
        onClick={togglePlay}
        aria-label="Attached video"
        className="size-full cursor-pointer object-contain"
      />

      {!isPlaying && (
        <button
          type="button"
          onClick={togglePlay}
          aria-label="Play"
          className="absolute inset-0 m-auto flex size-14 items-center justify-center rounded-full bg-background/85 text-foreground shadow-lg backdrop-blur transition-transform hover:scale-105 focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
        >
          <HugeiconsIcon icon={PlayIcon} className="size-6 translate-x-0.5" />
        </button>
      )}

      <div
        className={cn(
          "absolute inset-x-0 bottom-0 flex items-center gap-2 bg-linear-to-t from-black/75 to-transparent px-3 pt-10 pb-3 text-white transition-opacity",
          isPlaying &&
            "opacity-0 group-focus-within/video:opacity-100 group-hover/video:opacity-100",
        )}
      >
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="flex size-8 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-white/15"
        >
          <HugeiconsIcon icon={isPlaying ? PauseIcon : PlayIcon} className="size-4" />
        </button>
        <MediaSeekBar currentTime={currentTime} duration={duration} onSeek={seek} />
        <button
          type="button"
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute" : "Mute"}
          className="flex size-8 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-white/15"
        >
          <HugeiconsIcon icon={isMuted ? VolumeMute02Icon : VolumeHighIcon} className="size-4" />
        </button>
        <button
          type="button"
          onClick={enterFullscreen}
          aria-label="Full screen"
          className="flex size-8 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-white/15"
        >
          <HugeiconsIcon icon={FullScreenIcon} className="size-4" />
        </button>
      </div>
    </div>
  );
};
