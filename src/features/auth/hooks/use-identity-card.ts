import { IDENTITY_LIFESPAN_SECONDS } from "@/features/auth/constants/identity-lifespan-seconds";
import { useSession } from "@/features/auth/hooks/use-session";

// Suspends until the session resolves: render it below a <Suspense> boundary
export const useIdentityCard = () => {
  const session = useSession();
  const user = session?.user;

  if (!user) return { user: null };

  const endsAt = new Date(user.expiresAt);

  return {
    user,
    endsAt,
    startsAt: new Date(user.expiresAt - IDENTITY_LIFESPAN_SECONDS * 1_000),
  };
};
