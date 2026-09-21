import { Skeleton } from "@/shared/components/ui/skeleton";

// The shape of one comment: avatar, byline, a couple of lines and its footer
export const CommentSkeleton = () => (
  <div className="flex gap-4">
    <Skeleton className="size-8 shrink-0" />
    <div className="flex flex-1 flex-col gap-2.5 rounded-3xl bg-muted/30 p-5">
      <Skeleton className="h-4 w-44" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="mt-1 h-7 w-24" />
    </div>
  </div>
);
