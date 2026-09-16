import type { z } from "zod";

import type { commentFormSchema } from "@/features/comments/schemas/comment-form-schema";

export type CommentFormValues = z.infer<typeof commentFormSchema>;
