import { Skeleton } from "@/shared/components/ui/skeleton";

import { FeedSkeleton } from "@/features/posts/components/feed-skeleton";

export const ProfilePageSkeleton = () => (
  <div className="flex flex-col gap-12 py-4">
    <div className="flex flex-col items-center gap-6">
      <Skeleton className="size-24" />

      <div className="flex flex-col items-center gap-2">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-5 w-32" />
      </div>

      <Skeleton className="h-5 w-44" />
    </div>

    <div className="flex flex-wrap justify-center gap-10">
      {[0, 1, 2, 3].map((index) => (
        <div key={index} className="flex flex-col items-center gap-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-6 w-10" />
        </div>
      ))}
    </div>

    <Skeleton className="h-9 w-48 self-center" />

    <FeedSkeleton />
  </div>
);
