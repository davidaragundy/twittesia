import type { z } from "zod";

import type { changeNameFormSchema } from "@/features/settings/schemas/change-name-form-schema";

export type ChangeNameFormValues = z.infer<typeof changeNameFormSchema>;
