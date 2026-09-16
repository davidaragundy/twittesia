import type { z } from "zod";

import type { toggleCommentReactionSchema } from "@/features/comments/schemas/toggle-comment-reaction-schema";

export type ToggleCommentReactionInput = z.infer<typeof toggleCommentReactionSchema>;
