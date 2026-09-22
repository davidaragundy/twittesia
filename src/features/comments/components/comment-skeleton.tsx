import { Skeleton } from "@/shared/components/ui/skeleton";

// The shape of one comment's card: avatar and name, a line or two, its actions
export const CommentSkeleton = () => (
  <div className="flex flex-col gap-3 rounded-3xl bg-muted/30 p-4 sm:p-5">
    <div className="flex items-center gap-3">
      <Skeleton className="size-8 shrink-0" />
      <Skeleton className="h-4 w-32" />
    </div>
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-8 w-16" />
  </div>
);
