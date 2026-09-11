import type { z } from "zod";

import type { magicLinkFormSchema } from "@/features/auth/schemas/magic-link-form-schema";

export type MagicLinkFormValues = z.infer<typeof magicLinkFormSchema>;
