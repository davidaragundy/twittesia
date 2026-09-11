import MagicLink from "@/features/auth/emails/magic-link";
import { sendAuthEmail } from "@/features/auth/utils/send-auth-email";

interface Props {
  email: string;
  url: string;
  token: string;
}

export const sendMagicLink = ({ email, url }: Props) =>
  sendAuthEmail({
    to: email,
    subject: "Sign in with Magic Link",
    react: MagicLink({ url }),
    errorCode: "FAILED_TO_SEND_MAGIC_LINK",
  });
