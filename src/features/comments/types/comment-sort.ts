import type { z } from "zod";

import type { commentSortSchema } from "@/features/comments/schemas/comment-sort-schema";

export type CommentSort = z.infer<typeof commentSortSchema>;
