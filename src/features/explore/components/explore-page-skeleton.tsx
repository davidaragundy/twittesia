import { Skeleton } from "@/shared/components/ui/skeleton";

import { FeedSkeleton } from "@/features/posts/components/feed-skeleton";

// The title and search box, then what sits under them before anything is searched: popular posts
export const ExplorePageSkeleton = () => (
  <div className="flex flex-col gap-10">
    <div className="flex flex-col gap-6">
      <Skeleton className="h-9 w-32" />
      <Skeleton className="h-9 w-full" />
    </div>
    <FeedSkeleton />
  </div>
);
