import { APIError } from "better-auth";

import { resend } from "@/shared/lib/resend/server";
import { tryCatch } from "@/shared/utils/try-catch";

import { AUTH_EMAIL_ERROR_CODES } from "@/features/auth/constants/auth-email-error-codes";
import { AUTH_EMAIL_FROM } from "@/features/auth/constants/auth-email-from";

interface Props {
  to: string;
  subject: string;
  react: React.ReactNode;
  // Thrown to better-auth when the email can't be sent, so the client can react to it
  errorCode: keyof typeof AUTH_EMAIL_ERROR_CODES;
}

export const sendAuthEmail = async ({ to, subject, react, errorCode }: Props) => {
  const { data, error } = await tryCatch(
    resend.emails.send({ from: AUTH_EMAIL_FROM, to: [to], subject, react }),
  );

  if (error || data.error) {
    throw APIError.from("INTERNAL_SERVER_ERROR", {
      code: errorCode,
      message: AUTH_EMAIL_ERROR_CODES[errorCode],
    });
  }
};
