import type { User } from "better-auth";

import VerifyEmail from "@/features/auth/emails/verify-email";
import { sendAuthEmail } from "@/features/auth/utils/send-auth-email";

interface Props {
  user: User;
  url: string;
  token: string;
}

export const sendVerificationEmail = ({ user, url }: Props) =>
  sendAuthEmail({
    to: user.email,
    subject: "Verify your email address",
    react: VerifyEmail({ name: user.name, url }),
    errorCode: "FAILED_TO_SEND_VERIFICATION_EMAIL",
  });
