import { z } from "zod";

import { MAX_COMMENT_LENGTH } from "@/features/comments/constants/max-comment-length";

export const commentFormSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, { message: "Write something first" })
    .max(MAX_COMMENT_LENGTH, {
      message: `A comment can be at most ${MAX_COMMENT_LENGTH} characters long`,
    }),
});
