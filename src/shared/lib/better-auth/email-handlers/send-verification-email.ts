import { APIError, type User } from "better-auth";

import VerifyEmail from "@/shared/lib/react-email/verify-email";
import { resend } from "@/shared/lib/resend/server";

export const sendVerificationEmail = async ({
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
    subject: "Verify your email address",
    react: VerifyEmail({ name: user.name, url }),
  });

  if (error)
    throw new APIError("INTERNAL_SERVER_ERROR", {
      message: "Failed to send verification email",
    });
};
