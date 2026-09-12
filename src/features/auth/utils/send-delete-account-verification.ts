import type { User } from "better-auth";

import DeleteAccount from "@/features/auth/emails/delete-account";
import { sendAuthEmail } from "@/features/auth/utils/send-auth-email";

interface Props {
  user: User;
  url: string;
  token: string;
}

export const sendDeleteAccountVerification = ({ user, url }: Props) =>
  sendAuthEmail({
    to: user.email,
    subject: "Confirm deleting your account",
    react: DeleteAccount({ name: user.name, url }),
    errorCode: "FAILED_TO_SEND_DELETE_ACCOUNT_VERIFICATION",
  });
