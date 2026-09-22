import { Skeleton } from "@/shared/components/ui/skeleton";

import { FeedSkeleton } from "@/features/posts/components/feed-skeleton";

// The profile as it will arrive: who it is, their counts, the tabs and the posts
export const ProfilePageSkeleton = () => (
  <div className="flex flex-col gap-10">
    <div className="flex flex-col items-center gap-8 rounded-3xl bg-muted/30 px-5 py-10 sm:py-12">
      <Skeleton className="size-24" />

      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-36" />
        </div>
        <Skeleton className="h-6 w-28" />
      </div>

      <div className="flex gap-10 sm:gap-14">
        {[0, 1, 2, 3].map((index) => (
          <div key={index} className="flex flex-col items-center gap-1.5">
            <Skeleton className="h-6 w-8" />
            <Skeleton className="h-3 w-12" />
          </div>
        ))}
      </div>
    </div>

    <Skeleton className="h-9 w-48 self-center" />

    <FeedSkeleton />
  </div>
);
