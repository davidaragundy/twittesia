import { z } from "zod";

import { chatIdSchema } from "@/features/chat/schemas/chat-id-schema";

// Who the creator is answering, in which chat
export const knockDecisionSchema = z.object({ chatId: chatIdSchema, identityId: z.uuid() });
