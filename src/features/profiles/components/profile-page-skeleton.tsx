import { Skeleton } from "@/shared/components/ui/skeleton";

import { FeedSkeleton } from "@/features/posts/components/feed-skeleton";

// The profile as it will arrive: the card with who it is and their counts, the tabs, the posts
export const ProfilePageSkeleton = () => (
  <div className="flex flex-col gap-10">
    <div className="flex flex-col items-center gap-6 rounded-3xl bg-muted/30 px-4 pt-10 pb-4 sm:px-6 sm:pb-6">
      <Skeleton className="size-24" />

      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-5 w-32" />
        </div>
        <Skeleton className="h-6 w-28" />
      </div>

      <div className="grid w-full grid-cols-4 gap-2">
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className="flex flex-col items-center gap-2 rounded-2xl bg-background/60 px-2 py-3"
          >
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
