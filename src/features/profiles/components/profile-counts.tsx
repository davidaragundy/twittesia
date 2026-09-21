import { PROFILE_COUNT_FORMAT } from "@/features/profiles/constants/profile-count-format";
import type { ProfileStats } from "@/features/profiles/types/profile-stats";

interface Props {
  stats: ProfileStats;
}

// Only what is still alive, which is the only thing anyone can read anyway
export const ProfileCounts = ({ stats }: Props) => (
  <dl className="grid w-full grid-cols-4 gap-2 text-center">
    {[
      { label: "Posts", value: stats.postCount },
      { label: "Comments", value: stats.commentCount },
      { label: "Reactions", value: stats.reactionCount },
      { label: "Views", value: stats.viewCount },
    ].map(({ label, value }) => (
      <div
        key={label}
        className="flex flex-col-reverse gap-1 rounded-2xl bg-background/60 px-2 py-3"
      >
        <dt className="truncate text-xs text-muted-foreground">{label}</dt>
        <dd className="text-xl font-semibold tabular-nums">{PROFILE_COUNT_FORMAT.format(value)}</dd>
      </div>
    ))}
  </dl>
);
