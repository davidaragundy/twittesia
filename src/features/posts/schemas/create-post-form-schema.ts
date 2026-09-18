import { z } from "zod";

import { MAX_POST_LENGTH } from "@/features/posts/constants/max-post-length";

// The text may be empty: a post can be its media alone, which the composer and the action check
export const createPostFormSchema = z.object({
  content: z
    .string()
    .trim()
    .max(MAX_POST_LENGTH, { message: `A post can be at most ${MAX_POST_LENGTH} characters long` }),
});
