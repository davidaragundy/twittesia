import { APIError, type User } from "better-auth";

import { resend } from "@/shared/lib/resend/server";
import ExistingUserSignUpEmail from "@/shared/lib/react-email/existing-user-sign-up";

export const sendExistingUserSignUpEmail = async (
  data: {
    user: User;
  },
  request?: Request,
): Promise<void> => {
  const response = await resend.emails.send({
    from: "Twittesia <no-reply@twittesia.aragundy.com>",
    to: [data.user.email],
    subject: "Double sign up detected",
    react: ExistingUserSignUpEmail({ user: data.user, request }),
  });

  if (response.error)
    throw new APIError("INTERNAL_SERVER_ERROR", {
      message: "Failed to send existing user sign up email",
    });
};
