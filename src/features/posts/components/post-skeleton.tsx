import { Skeleton } from "@/shared/components/ui/skeleton";

// The shape of one post: avatar, byline, a couple of lines and its actions
export const PostSkeleton = () => (
  <div className="flex gap-4 py-4">
    <Skeleton className="size-10 shrink-0" />
    <div className="flex flex-1 flex-col gap-3 pt-1">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-8 w-24" />
    </div>
  </div>
);
