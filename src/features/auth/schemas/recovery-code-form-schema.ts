import { z } from "zod";

export const recoveryCodeFormSchema = z.object({
  code: z.string().length(11, {
    message: "Recovery codes are 11 characters long, like abcde-fghij",
  }),
});
