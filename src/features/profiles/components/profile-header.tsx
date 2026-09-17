import { SeededAvatar } from "@/shared/components/seeded-avatar";
import { formatRelativeTime } from "@/shared/utils/format-relative-time";

import { POST_DATE_FORMAT } from "@/features/posts/constants/post-date-format";
import type { Profile } from "@/features/profiles/types/profile";
import { getIdentityExpiry } from "@/features/profiles/utils/get-identity-expiry";

interface Props {
  profile: Profile;
}

export const ProfileHeader = ({ profile }: Props) => {
  const expiresAt = getIdentityExpiry({ createdAt: profile.createdAt });

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <SeededAvatar seed={profile.username ?? profile.id} size="lg" className="size-24" />

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">{profile.name}</h1>
        <p className="[font-feature-settings:'calt'_0] text-muted-foreground">
          @{profile.displayUsername ?? profile.username}
        </p>
      </div>

      {/* The clock differs between the server and the browser by a moment */}
      <p className="text-sm text-muted-foreground">
        This identity ends{" "}
        <time
          dateTime={expiresAt.toISOString()}
          title={POST_DATE_FORMAT.format(expiresAt)}
          suppressHydrationWarning
        >
          {formatRelativeTime(expiresAt)}
        </time>
      </p>
    </div>
  );
};
