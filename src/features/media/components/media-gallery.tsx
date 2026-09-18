import { MediaAudio } from "@/features/media/components/media-audio";
import { MediaCarousel } from "@/features/media/components/media-carousel";
import { MediaSlide } from "@/features/media/components/media-slide";
import type { Media } from "@/features/media/types/media";
import { getMediaAspectRatio } from "@/features/media/utils/get-media-aspect-ratio";

interface Props {
  media: Media[];
}

// A lone file in its own shape; more than one, in a carousel
export const MediaGallery = ({ media }: Props) => {
  const [only] = media;

  if (!only) return null;

  if (media.length > 1) return <MediaCarousel media={media} />;

  if (only.kind === "audio") return <MediaAudio media={only} />;

  return <MediaSlide media={only} aspectRatio={getMediaAspectRatio(only)} />;
};
