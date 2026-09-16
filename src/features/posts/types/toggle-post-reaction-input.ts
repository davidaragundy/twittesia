import type { z } from "zod";

import type { togglePostReactionSchema } from "@/features/posts/schemas/toggle-post-reaction-schema";

export type TogglePostReactionInput = z.infer<typeof togglePostReactionSchema>;
