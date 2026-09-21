import { RelativeTime } from "@/shared/components/relative-time";
import { SeededAvatar } from "@/shared/components/seeded-avatar";

import { getIdentityExpiry } from "@/features/auth/utils/get-identity-expiry";
import type { Profile } from "@/features/profiles/types/profile";

interface Props {
  profile: Profile;
}

export const ProfileHeader = ({ profile }: Props) => {
  const expiresAt = new Date(getIdentityExpiry({ createdAt: profile.createdAt }));

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <SeededAvatar seed={profile.handle} size="lg" className="size-24" />

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">{profile.name}</h1>
        <p className="handle text-muted-foreground">@{profile.handle}</p>
      </div>

      <p className="text-sm text-muted-foreground">
        This identity ends <RelativeTime date={expiresAt} />
      </p>
    </div>
  );
};
