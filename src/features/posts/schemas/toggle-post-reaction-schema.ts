import { z } from "zod";

import { POST_REACTION_KEYS } from "@/features/posts/constants/post-reaction-keys";

export const togglePostReactionSchema = z.object({
  postId: z.string().min(1),
  reaction: z.enum(POST_REACTION_KEYS),
});
