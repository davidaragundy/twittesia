"use client";

import type { Session } from "@/features/auth/types";
import { SessionContext } from "@/features/auth/utils/session-context";

type Props = {
  session: Promise<Session | null>;
  children: React.ReactNode;
};

export function SessionProvider({ session, children }: Props) {
  return <SessionContext value={session}>{children}</SessionContext>;
}
