import { APIError } from "better-auth";
import { type UserWithTwoFactor } from "better-auth/plugins";

import { resend } from "@/shared/lib/resend/server";
import TwoFactorOTP from "@/shared/lib/react-email/two-factor-otp";

export const sendOTP = async ({
  user,
  otp,
}: {
  user: UserWithTwoFactor;
  otp: string;
}): Promise<void> => {
  const { error } = await resend.emails.send({
    from: "Twittesia <no-reply@twittesia.aragundy.com>",
    to: [user.email],
    subject: "Two-factor authentication OTP",
    react: TwoFactorOTP({ name: user.name, otp }),
  });

  if (error)
    throw new APIError("INTERNAL_SERVER_ERROR", {
      message: "Failed to send two-factor authentication OTP",
    });
};
