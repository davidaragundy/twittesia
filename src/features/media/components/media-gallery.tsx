import { cn } from "cn";

import { MediaAudio } from "@/features/media/components/media-audio";
import { MediaImage } from "@/features/media/components/media-image";
import { MediaVideo } from "@/features/media/components/media-video";
import type { Media } from "@/features/media/types/media";
import { getMediaAspectRatio } from "@/features/media/utils/get-media-aspect-ratio";

interface Props {
  media: Media[];
}

// Images share one grid, as many a phone screen fits at a glance; video and audio each take the
// full width, in the order they were attached
export const MediaGallery = ({ media }: Props) => {
  if (!media.length) return null;

  const images = media.filter((item) => item.kind === "image");
  const players = media.filter((item) => item.kind !== "image");
  const [first] = images;

  return (
    <div className="flex flex-col gap-2">
      {images.length === 1 && first && (
        <MediaImage
          media={first}
          className="w-full rounded-3xl ring-1 ring-foreground/5"
          style={{ aspectRatio: getMediaAspectRatio(first) }}
        />
      )}

      {images.length > 1 && (
        <div
          className={cn(
            "grid aspect-video grid-cols-2 gap-1 overflow-hidden rounded-3xl ring-1 ring-foreground/5",
            images.length > 2 && "grid-rows-2",
          )}
        >
          {images.map((item, index) => (
            <MediaImage
              key={item.id}
              media={item}
              className={cn("size-full", images.length === 3 && index === 0 && "row-span-2")}
            />
          ))}
        </div>
      )}

      {players.map((item) =>
        item.kind === "video" ? (
          <MediaVideo key={item.id} media={item} />
        ) : (
          <MediaAudio key={item.id} media={item} />
        ),
      )}
    </div>
  );
};
