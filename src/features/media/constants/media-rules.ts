import { BYTES_PER_MEGABYTE } from "@/features/media/constants/bytes-per-megabyte";
import type { MediaKind } from "@/features/media/types/media-kind";

// What each kind may be. The sizes keep a day of uploads well inside the Hobby plan's 1 GB of
// storage and 10 GB of transfer; the types are the ones every current browser can play or show.
// SVG is left out on purpose: it can carry script, and Blob would serve it inline.
export const MEDIA_RULES: Record<
  MediaKind,
  { maxBytes: number; contentTypes: string[]; extensions: Record<string, string> }
> = {
  image: {
    maxBytes: 5 * BYTES_PER_MEGABYTE,
    contentTypes: ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"],
    extensions: {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "image/gif": "gif",
      "image/avif": "avif",
    },
  },
  video: {
    maxBytes: 25 * BYTES_PER_MEGABYTE,
    contentTypes: ["video/mp4", "video/webm", "video/quicktime"],
    extensions: { "video/mp4": "mp4", "video/webm": "webm", "video/quicktime": "mov" },
  },
  audio: {
    maxBytes: 10 * BYTES_PER_MEGABYTE,
    contentTypes: [
      "audio/mpeg",
      "audio/mp4",
      "audio/x-m4a",
      "audio/aac",
      "audio/ogg",
      "audio/wav",
      "audio/webm",
    ],
    extensions: {
      "audio/mpeg": "mp3",
      "audio/mp4": "m4a",
      "audio/x-m4a": "m4a",
      "audio/aac": "aac",
      "audio/ogg": "ogg",
      "audio/wav": "wav",
      "audio/webm": "weba",
    },
  },
};
