import type { User } from "better-auth";

import ResetPassword from "@/features/auth/emails/reset-password";
import { sendAuthEmail } from "@/features/auth/utils/send-auth-email";

interface Props {
  user: User;
  url: string;
  token: string;
}

export const sendResetPassword = ({ user, url }: Props) =>
  sendAuthEmail({
    to: user.email,
    subject: "Reset your password",
    react: ResetPassword({ name: user.name, url }),
    errorCode: "FAILED_TO_SEND_RESET_PASSWORD_EMAIL",
  });
