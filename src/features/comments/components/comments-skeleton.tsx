import { Skeleton } from "@/shared/components/ui/skeleton";

import { CommentSkeleton } from "@/features/comments/components/comment-skeleton";

// The comments section as it will arrive: its heading and order, the composer and a few comments
export const CommentsSkeleton = () => (
  <div className="flex flex-col gap-6">
    <div className="flex items-center justify-between">
      <Skeleton className="h-6 w-28" />
      <Skeleton className="h-8 w-28" />
    </div>

    <div className="flex gap-3">
      <Skeleton className="size-8 shrink-0" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="mt-2 h-4 w-28" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>

    <div className="flex flex-col gap-1">
      <CommentSkeleton />
      <CommentSkeleton />
    </div>
  </div>
);
