import type { z } from "zod";

import type { changeUsernameFormSchema } from "@/features/settings/schemas/change-username-form-schema";

export type ChangeUsernameFormValues = z.infer<typeof changeUsernameFormSchema>;
