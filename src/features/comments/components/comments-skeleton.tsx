import { Skeleton } from "@/shared/components/ui/skeleton";

import { CommentSkeleton } from "@/features/comments/components/comment-skeleton";

// The comments section as it will arrive: its title, the composer, the order control and a few
// comments
export const CommentsSkeleton = () => (
  <div className="flex flex-col gap-8">
    <Skeleton className="h-6 w-28" />

    <div className="flex gap-4">
      <Skeleton className="mt-1.5 hidden size-8 shrink-0 sm:block" />
      <Skeleton className="h-24 w-full" />
    </div>

    <div className="flex flex-col gap-4">
      <Skeleton className="h-8 w-40 self-end" />
      <div className="-mx-4 flex flex-col sm:-mx-5">
        <CommentSkeleton />
        <CommentSkeleton />
      </div>
    </div>
  </div>
);
