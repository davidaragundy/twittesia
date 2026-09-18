import type { z } from "zod";

import type { mediaKindSchema } from "@/features/media/schemas/media-kind-schema";

export type MediaKind = z.infer<typeof mediaKindSchema>;
