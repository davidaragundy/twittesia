import { z } from "zod";

import { chatIdSchema } from "@/features/chat/schemas/chat-id-schema";

export const announceKeySchema = z.object({
  chatId: chatIdSchema,
  publicKey: z.string().min(1).max(256),
  reply: z.boolean(),
});
