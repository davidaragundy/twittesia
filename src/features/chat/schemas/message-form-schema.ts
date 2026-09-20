import { z } from "zod";

import { MAX_MESSAGE_LENGTH } from "@/features/chat/constants/max-message-length";

export const messageFormSchema = z.object({
  body: z
    .string()
    .trim()
    .max(MAX_MESSAGE_LENGTH, {
      message: `A message can be at most ${MAX_MESSAGE_LENGTH} characters long`,
    }),
});
