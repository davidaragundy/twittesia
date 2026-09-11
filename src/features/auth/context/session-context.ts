import { createContext } from "react";

import type { Session } from "@/features/auth/types/session";

// Holds the session promise the signed-in layout starts, so the layout never waits for it
export const SessionContext = createContext<Promise<Session | null> | null>(null);
