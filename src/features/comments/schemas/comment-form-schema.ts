import { z } from "zod";

import { MAX_COMMENT_LENGTH } from "@/features/comments/constants/max-comment-length";

// The text may be empty: a comment can be its media alone, which the composer and the action check
export const commentFormSchema = z.object({
  content: z
    .string()
    .trim()
    .max(MAX_COMMENT_LENGTH, {
      message: `A comment can be at most ${MAX_COMMENT_LENGTH} characters long`,
    }),
});
