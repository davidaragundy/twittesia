import { Clock01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { RelativeTime } from "@/shared/components/relative-time";
import { SeededAvatar } from "@/shared/components/seeded-avatar";
import { Badge } from "@/shared/components/ui/badge";

import { getIdentityExpiry } from "@/features/auth/utils/get-identity-expiry";
import type { Profile } from "@/features/profiles/types/profile";

interface Props {
  profile: Profile;
  // What sits at the foot of the card, such as the counts
  children?: React.ReactNode;
}

// Who this is, and how long they have left, on one card
export const ProfileHeader = ({ profile, children }: Props) => {
  const expiresAt = new Date(getIdentityExpiry({ createdAt: profile.createdAt }));

  return (
    <section
      aria-labelledby="profile-name"
      className="flex flex-col items-center gap-6 rounded-3xl bg-muted/30 px-4 pt-10 pb-4 text-center sm:px-6 sm:pb-6"
    >
      <SeededAvatar seed={profile.handle} size="lg" className="size-24" />

      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-col gap-1">
          <h1 id="profile-name" className="text-2xl font-semibold tracking-tight">
            {profile.name}
          </h1>
          <p className="handle text-muted-foreground">@{profile.handle}</p>
        </div>

        <Badge variant="secondary">
          <HugeiconsIcon icon={Clock01Icon} data-icon="inline-start" />
          Ends <RelativeTime date={expiresAt} />
        </Badge>
      </div>

      {children}
    </section>
  );
};
