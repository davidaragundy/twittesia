import { z } from "zod";

export const magicLinkFormSchema = z.object({
  email: z.email({ message: "Email must be a valid email address" }).trim(),
});
