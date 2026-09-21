"use client";

import {
  FullScreenIcon,
  PauseIcon,
  PlayIcon,
  VolumeHighIcon,
  VolumeMute02Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "cn";

import { Icon } from "@/shared/components/icon";
import { Button } from "@/shared/components/ui/button";

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
        "group/video relative aspect-(--media-aspect) overflow-hidden rounded-3xl bg-black",
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
        <Button
          type="button"
          size="icon-lg"
          onClick={togglePlay}
          aria-label="Play"
          className="absolute inset-0 m-auto"
        >
          <Icon icon={PlayIcon} />
        </Button>
      )}

      <div
        className={cn(
          "dark absolute inset-x-0 bottom-0 flex items-center gap-2 bg-linear-to-t from-black/75 to-transparent px-3 pt-10 pb-3 text-foreground transition-opacity",
          isPlaying &&
            "opacity-0 group-focus-within/video:opacity-100 group-hover/video:opacity-100",
        )}
      >
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="shrink-0"
        >
          <Icon icon={isPlaying ? PauseIcon : PlayIcon} />
        </Button>
        <MediaSeekBar currentTime={currentTime} duration={duration} onSeek={seek} />
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute" : "Mute"}
          className="shrink-0"
        >
          <Icon icon={isMuted ? VolumeMute02Icon : VolumeHighIcon} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={enterFullscreen}
          aria-label="Full screen"
          className="shrink-0"
        >
          <Icon icon={FullScreenIcon} />
        </Button>
      </div>
    </div>
  );
};
