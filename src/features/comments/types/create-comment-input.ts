import type { z } from "zod";

import type { createCommentSchema } from "@/features/comments/schemas/create-comment-schema";

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
