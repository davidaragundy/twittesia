import { RelativeTime } from "@/shared/components/relative-time";
import { SeededAvatar } from "@/shared/components/seeded-avatar";

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

      <div className="flex flex-col items-center gap-1.5">
        <h1 id="profile-name" className="text-2xl font-semibold tracking-tight">
          {profile.name}
        </h1>
        <p className="text-sm text-muted-foreground">
          <span className="handle">@{profile.handle}</span> · ends <RelativeTime date={expiresAt} />
        </p>
      </div>

      {children}
    </section>
  );
};
