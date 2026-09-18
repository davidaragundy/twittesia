import { MEDIA_ASPECT_RATIO_RANGE } from "@/features/media/constants/media-aspect-ratio-range";

interface Props {
  width: number | null;
  height: number | null;
}

export const getMediaAspectRatio = ({ width, height }: Props) => {
  const { min, max, fallback } = MEDIA_ASPECT_RATIO_RANGE;

  if (!width || !height) return fallback;

  return Math.min(Math.max(width / height, min), max);
};
