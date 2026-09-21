import { Skeleton } from "@/shared/components/ui/skeleton";

// The shape of one post: avatar, byline, a few lines and its reactions
export const PostSkeleton = () => (
  <div className="flex gap-4 px-4 py-5 sm:px-5">
    <Skeleton className="size-10 shrink-0" />
    <div className="flex flex-1 flex-col gap-3">
      <Skeleton className="h-4 w-56" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="mt-1 h-8 w-28" />
    </div>
  </div>
);
