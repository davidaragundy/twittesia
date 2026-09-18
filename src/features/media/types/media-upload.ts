import type { z } from "zod";

import type { mediaUploadSchema } from "@/features/media/schemas/media-upload-schema";

export type MediaUpload = z.infer<typeof mediaUploadSchema>;
