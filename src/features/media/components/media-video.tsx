import type { Media } from "@/features/media/types/media";
import { getMediaAspectRatio } from "@/features/media/utils/get-media-aspect-ratio";

interface Props {
  media: Media;
}

// Only the first frame and the duration load until someone presses play, to spare the plan's
// monthly transfer
export const MediaVideo = ({ media }: Props) => (
  <video
    src={media.url}
    controls
    playsInline
    preload="metadata"
    aria-label="Attached video"
    className="w-full rounded-3xl bg-black ring-1 ring-foreground/5"
    style={{ aspectRatio: getMediaAspectRatio(media) }}
  />
);
