import { Skeleton } from "@/shared/components/ui/skeleton";

// The shape of one comment: avatar, byline, a line or two and its actions
export const CommentSkeleton = () => (
  <div className="flex gap-3 py-3">
    <Skeleton className="size-8 shrink-0" />
    <div className="flex flex-1 flex-col gap-3 pt-1">
      <Skeleton className="h-4 w-36" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-8 w-16" />
    </div>
  </div>
);
