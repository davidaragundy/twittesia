import { redirect } from "next/navigation";

import { getSession } from "@/features/auth/queries/get-session";

// The proxy only checks that a session cookie exists; this checks the session behind it. A
// revoked or expired one goes through /session-expired, which clears the cookie, because the
// proxy would otherwise send a request that still carries it from the landing page back here.
export async function SessionGuard() {
  const session = await getSession();

  if (!session) redirect("/session-expired");

  return null;
}
