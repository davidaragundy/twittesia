import type { UserWithTwoFactor } from "better-auth/plugins";

import TwoFactorOTP from "@/features/auth/emails/two-factor-otp";
import { sendAuthEmail } from "@/features/auth/utils/send-auth-email";

interface Props {
  user: UserWithTwoFactor;
  otp: string;
}

export const sendOTP = ({ user, otp }: Props) =>
  sendAuthEmail({
    to: user.email,
    subject: "Two-factor authentication OTP",
    react: TwoFactorOTP({ name: user.name, otp }),
    errorCode: "FAILED_TO_SEND_TWO_FACTOR_OTP",
  });
