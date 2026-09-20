import { z } from "zod";

import { MAX_CIPHER_LENGTH } from "@/features/chat/constants/max-cipher-length";
import { chatIdSchema } from "@/features/chat/schemas/chat-id-schema";

// What the browser hands the server to pass on, which is as much as the server ever knows
export const sendMessageSchema = z.object({
  chatId: chatIdSchema,
  cipher: z.string().min(1).max(MAX_CIPHER_LENGTH),
  iv: z.string().min(1).max(64),
});
