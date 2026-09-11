import type { User } from "better-auth";

import ExistingUserSignUpEmail from "@/features/auth/emails/existing-user-sign-up";
import { sendAuthEmail } from "@/features/auth/utils/send-auth-email";

interface Props {
  user: User;
}

export const sendExistingUserSignUpEmail = ({ user }: Props, request?: Request) =>
  sendAuthEmail({
    to: user.email,
    subject: "Double sign up detected",
    react: ExistingUserSignUpEmail({ user, request }),
    errorCode: "FAILED_TO_SEND_EXISTING_USER_SIGN_UP_EMAIL",
  });
