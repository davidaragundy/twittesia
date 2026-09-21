import { PROFILE_COUNT_FORMAT } from "@/features/profiles/constants/profile-count-format";
import type { ProfileStats } from "@/features/profiles/types/profile-stats";

interface Props {
  stats: ProfileStats;
}

// Only what is still alive, which is the only thing anyone can read anyway
export const ProfileCounts = ({ stats }: Props) => (
  <dl className="flex items-start justify-center gap-10 sm:gap-14">
    {[
      { label: "Posts", value: stats.postCount },
      { label: "Comments", value: stats.commentCount },
      { label: "Reactions", value: stats.reactionCount },
      { label: "Views", value: stats.viewCount },
    ].map(({ label, value }) => (
      <div key={label} className="flex flex-col-reverse items-center gap-0.5">
        <dt className="text-xs text-muted-foreground">{label}</dt>
        <dd className="text-lg font-semibold tabular-nums">{PROFILE_COUNT_FORMAT.format(value)}</dd>
      </div>
    ))}
  </dl>
);
