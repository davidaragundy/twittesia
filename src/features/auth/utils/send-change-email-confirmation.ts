import type { User } from "better-auth";

import ChangeEmailConfirmation from "@/features/auth/emails/change-email-confirmation";
import { sendAuthEmail } from "@/features/auth/utils/send-auth-email";

interface Props {
  user: User;
  newEmail: string;
  url: string;
  token: string;
}

export const sendChangeEmailConfirmation = ({ user, newEmail, url }: Props) =>
  sendAuthEmail({
    to: user.email,
    subject: "Confirm your new email address",
    react: ChangeEmailConfirmation({ name: user.name, newEmail, url }),
    errorCode: "FAILED_TO_SEND_CHANGE_EMAIL_CONFIRMATION",
  });
