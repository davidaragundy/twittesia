import { z } from "zod";

import { commentFormSchema } from "@/features/comments/schemas/comment-form-schema";

export const createCommentSchema = commentFormSchema.extend({ postId: z.string().min(1) });
