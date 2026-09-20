import type { z } from "zod";

import type { messageFormSchema } from "@/features/chat/schemas/message-form-schema";

export type MessageFormValues = z.infer<typeof messageFormSchema>;
