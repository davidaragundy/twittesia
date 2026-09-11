import type { auth } from "@/features/auth/lib/auth";

type AuthSession = typeof auth.$Infer.Session;

// What the browser gets of the session: the fields the UI renders, never the token
export type Session = {
  user: Pick<
    AuthSession["user"],
    "id" | "name" | "email" | "image" | "username" | "displayUsername" | "twoFactorEnabled"
  >;
  session: Pick<AuthSession["session"], "id">;
};
