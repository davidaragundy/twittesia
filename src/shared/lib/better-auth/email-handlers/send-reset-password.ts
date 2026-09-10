import { APIError, type User } from "better-auth";

import ResetPassword from "@/shared/lib/react-email/reset-password";
import { resend } from "@/shared/lib/resend/server";

export const sendResetPassword = async ({
  user,
  url,
}: {
  user: User;
  url: string;
  token: string;
}): Promise<void> => {
  const { error } = await resend.emails.send({
    from: "Twittesia <no-reply@twittesia.aragundy.com>",
    to: [user.email],
    subject: "Reset your password",
    react: ResetPassword({ name: user.name, url }),
  });

  if (error)
    throw new APIError("INTERNAL_SERVER_ERROR", {
      message: "Failed to send reset password email",
    });
};
