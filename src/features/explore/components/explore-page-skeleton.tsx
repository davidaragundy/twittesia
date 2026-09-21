import { Skeleton } from "@/shared/components/ui/skeleton";

import { FeedSkeleton } from "@/features/posts/components/feed-skeleton";

// The search box, then what sits under it before anything is searched: the popular posts
export const ExplorePageSkeleton = () => (
  <div className="flex flex-col gap-10">
    <Skeleton className="h-9 w-full" />
    <FeedSkeleton />
  </div>
);
