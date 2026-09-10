import { APIError, type User } from "better-auth";

import ChangeEmailConfirmation from "@/shared/lib/react-email/change-email-confirmation";
import { resend } from "@/shared/lib/resend/server";

export const sendChangeEmailConfirmation = async ({
  user,
  newEmail,
  url,
}: {
  user: User;
  newEmail: string;
  url: string;
  token: string;
}): Promise<void> => {
  const { error } = await resend.emails.send({
    from: "Twittesia <no-reply@twittesia.aragundy.com>",
    to: [user.email],
    subject: "Confirm your new email address",
    react: ChangeEmailConfirmation({ name: user.name, newEmail, url }),
  });

  if (error)
    throw new APIError("FAILED_DEPENDENCY", {
      message: "Failed to send change email confirmation",
    });
};
