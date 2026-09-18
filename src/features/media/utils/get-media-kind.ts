import { MEDIA_RULES } from "@/features/media/constants/media-rules";
import type { MediaKind } from "@/features/media/types/media-kind";

interface Props {
  contentType: string;
}

// The kind a file's type belongs to, or null for a type none of them allows
export const getMediaKind = ({ contentType }: Props): MediaKind | null =>
  (Object.keys(MEDIA_RULES) as MediaKind[]).find((kind) =>
    MEDIA_RULES[kind].contentTypes.includes(contentType),
  ) ?? null;
