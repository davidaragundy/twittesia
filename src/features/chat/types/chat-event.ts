import type { z } from "zod";

import type { chatEventSchema } from "@/features/chat/schemas/chat-event-schema";

export type ChatEvent = z.infer<typeof chatEventSchema>;
