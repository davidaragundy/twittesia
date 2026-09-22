import { SeededAvatar } from "@/shared/components/seeded-avatar";

import { IdentityExpiryBadge } from "@/features/auth/components/identity-expiry-badge";
import { getIdentityExpiry } from "@/features/auth/utils/get-identity-expiry";
import type { Profile } from "@/features/profiles/types/profile";

interface Props {
  profile: Profile;
  // What follows who they are, such as the counts
  children?: React.ReactNode;
}

// Who this is, and how long they have left
export const ProfileHeader = ({ profile, children }: Props) => {
  const expiresAt = new Date(getIdentityExpiry({ createdAt: profile.createdAt }));

  return (
    <section
      aria-labelledby="profile-name"
      className="flex flex-col items-center gap-8 pt-6 text-center"
    >
      <SeededAvatar seed={profile.handle} size="lg" className="size-24" />

      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-col items-center gap-1">
          <h1 id="profile-name" className="text-3xl font-bold tracking-tight sm:text-4xl">
            {profile.name}
          </h1>
          <p className="handle text-sm text-muted-foreground">@{profile.handle}</p>
        </div>

        <IdentityExpiryBadge expiresAt={expiresAt} />
      </div>

      {children}
    </section>
  );
};
