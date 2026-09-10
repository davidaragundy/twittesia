import { APIError } from "better-auth";
import { type UserWithTwoFactor } from "better-auth/plugins";

import TwoFactorOTP from "@/shared/lib/react-email/two-factor-otp";
import { resend } from "@/shared/lib/resend/server";

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
