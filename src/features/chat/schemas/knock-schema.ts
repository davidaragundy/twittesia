import { z } from "zod";

import { chatIdSchema } from "@/features/chat/schemas/chat-id-schema";

export const knockSchema = z.object({ chatId: chatIdSchema });
