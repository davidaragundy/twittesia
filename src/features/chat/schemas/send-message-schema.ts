import { z } from "zod";

import { MAX_MESSAGE_LENGTH } from "@/features/chat/constants/max-message-length";
import { chatIdSchema } from "@/features/chat/schemas/chat-id-schema";

export const sendMessageSchema = z.object({
  chatId: chatIdSchema,
  body: z
    .string()
    .trim()
    .min(1, { message: "Write something first" })
    .max(MAX_MESSAGE_LENGTH, {
      message: `A message can be at most ${MAX_MESSAGE_LENGTH} characters long`,
    }),
});
