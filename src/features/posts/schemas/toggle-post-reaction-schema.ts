import { z } from "zod";

import { SINGLE_EMOJI_PATTERN } from "@/features/posts/constants/single-emoji-pattern";

export const togglePostReactionSchema = z.object({
  postId: z.string().min(1),
  emoji: z.string().regex(SINGLE_EMOJI_PATTERN, { message: "Pick a single emoji" }),
});
