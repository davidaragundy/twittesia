import { z } from "zod";

export const forgotPasswordFormSchema = z.object({
  email: z.email({ message: "Email must be a valid email address" }).trim(),
});
