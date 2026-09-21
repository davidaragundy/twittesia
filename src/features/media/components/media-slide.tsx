import { MusicNote03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { MediaAudio } from "@/features/media/components/media-audio";
import { MediaImage } from "@/features/media/components/media-image";
import { MediaVideo } from "@/features/media/components/media-video";
import type { Media } from "@/features/media/types/media";

interface Props {
  media: Media;
  // Every slide of a carousel shares the first one's shape, so the frame never jumps
  aspectRatio: number;
}

export const MediaSlide = ({ media, aspectRatio }: Props) => {
  if (media.kind === "image") {
    return (
      <MediaImage
        media={media}
        className="aspect-(--media-aspect) w-full rounded-3xl"
        style={{ "--media-aspect": aspectRatio } as React.CSSProperties}
      />
    );
  }

  if (media.kind === "video") return <MediaVideo media={media} aspectRatio={aspectRatio} />;

  // Wide enough margins that the carousel's arrows never sit on the player
  return (
    <div
      className="flex aspect-(--media-aspect) flex-col items-center justify-center gap-5 rounded-3xl bg-muted/40 px-4 sm:px-16"
      style={{ "--media-aspect": aspectRatio } as React.CSSProperties}
    >
      <span className="flex size-16 items-center justify-center rounded-full bg-background/70 text-muted-foreground">
        <HugeiconsIcon icon={MusicNote03Icon} className="size-7" />
      </span>
      <MediaAudio media={media} className="w-full max-w-sm" />
    </div>
  );
};
