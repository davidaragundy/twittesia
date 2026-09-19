import "server-only";

import { cookies } from "next/headers";

import { SESSION_COOKIE_NAME } from "@/features/auth/constants/session-cookie-name";

interface Props {
  token: string;
  // Milliseconds since the epoch; a time already past removes the cookie
  expiresAt: number;
}

// HttpOnly, so no script can read the token; Lax, so another site's form can't send it; Secure
// wherever there is HTTPS. The same attributes remove it, since a __Host- cookie can only be
// overwritten by one that has them.
export const setSessionCookie = async ({ token, expiresAt }: Props) => {
  const store = await cookies();

  store.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(expiresAt),
  });
};
