"use client";

import { SessionContext } from "@/features/auth/context/session-context";
import type { Session } from "@/features/auth/types/session";

type Props = {
  session: Promise<Session | null>;
  children: React.ReactNode;
};

export function SessionContextProvider({ session, children }: Props) {
  return <SessionContext value={session}>{children}</SessionContext>;
}
