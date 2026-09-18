import { MEDIA_RULES } from "@/features/media/constants/media-rules";

// Everything the file picker offers, as its accept attribute
export const MEDIA_ACCEPT = Object.values(MEDIA_RULES)
  .flatMap((rule) => rule.contentTypes)
  .join(",");
