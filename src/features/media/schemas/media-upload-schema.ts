import { z } from "zod";

import { MEDIA_PATHNAME_PATTERN } from "@/features/media/constants/media-pathname-pattern";

// A finished upload the browser asks to attach. The dimensions are only for laying it out, so
// they are taken as given; everything else is confirmed with the store.
export const mediaUploadSchema = z.object({
  pathname: z.string().regex(MEDIA_PATHNAME_PATTERN),
  width: z.number().int().positive().max(20_000).nullable(),
  height: z.number().int().positive().max(20_000).nullable(),
});
