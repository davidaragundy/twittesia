import { z } from "zod";

export const recoveryCodeFormSchema = z.object({
  code: z.string().length(11),
});
