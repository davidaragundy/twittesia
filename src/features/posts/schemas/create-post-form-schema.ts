import { z } from "zod";

import { MAX_POST_LENGTH } from "@/features/posts/constants/max-post-length";

export const createPostFormSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, { message: "Write something first" })
    .max(MAX_POST_LENGTH, { message: `A post can be at most ${MAX_POST_LENGTH} characters long` }),
});
