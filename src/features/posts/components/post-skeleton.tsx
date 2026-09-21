import { Skeleton } from "@/shared/components/ui/skeleton";

// The shape of one post: avatar, byline, a few lines and its reactions
export const PostSkeleton = () => (
  <div className="flex gap-4">
    <Skeleton className="size-10 shrink-0" />
    <div className="flex flex-1 flex-col gap-3 rounded-3xl bg-muted/30 px-5 pt-4 pb-3">
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3.5 w-44" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-8 w-28" />
    </div>
  </div>
);
