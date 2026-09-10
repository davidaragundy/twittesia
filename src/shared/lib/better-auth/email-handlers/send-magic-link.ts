import { APIError } from "better-auth";

import { resend } from "@/shared/lib/resend/server";
import MagicLink from "@/shared/lib/react-email/magic-link";

export const sendMagicLink = async (
  {
    email,
    url,
  }: {
    email: string;
    url: string;
    token: string;
  },
  //   ctx?: GenericEndpointContext | undefined,
): Promise<void> => {
  const { error } = await resend.emails.send({
    from: "Twittesia <no-reply@twittesia.aragundy.com>",
    to: [email],
    subject: "Sign in with Magic Link",
    react: MagicLink({ url }),
  });

  if (error)
    throw new APIError("INTERNAL_SERVER_ERROR", {
      message: "Failed to send magic link",
    });
};
