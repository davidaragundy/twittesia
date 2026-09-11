import { SessionContextProvider } from "@/features/auth/components/session-context-provider";
import { getSession } from "@/features/auth/queries/get-session";

type Props = {
  children: React.ReactNode;
};

// Starts the session read without waiting for it. It reads the request, so render this inside
// the <Suspense> boundary of whatever needs the session, never at the top of a layout.
export function SessionProvider({ children }: Props) {
  return <SessionContextProvider session={getSession()}>{children}</SessionContextProvider>;
}
