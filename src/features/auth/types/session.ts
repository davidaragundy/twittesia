import type { auth } from "@/features/auth/lib/auth";

type AuthSession = typeof auth.$Infer.Session;

// What the browser gets of the session: the fields the UI renders, never the token. There is no
// email here because nobody gives one, and none of the placeholder address better-auth invents
// to satisfy its own schema should ever reach a screen.
export type Session = {
  user: Pick<AuthSession["user"], "id" | "name" | "image" | "username" | "displayUsername">;
  session: Pick<AuthSession["session"], "id">;
};
