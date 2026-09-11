import { use } from "react";

import { SessionContext } from "@/features/auth/utils/session-context";

// Suspends until the session resolves: call it below a <Suspense> boundary
export const useSession = () => {
  const session = use(SessionContext);

  if (!session) throw new Error("useSession must be used within a SessionProvider.");

  return use(session);
};
