import { z } from "zod";

export const forgotPasswordFormSchema = z.object({
  email: z.email().trim(),
});
