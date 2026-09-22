import { Skeleton } from "@/shared/components/ui/skeleton";

// The shape of one post's card: avatar and name, a couple of lines, its actions
export const PostSkeleton = () => (
  <div className="flex flex-col gap-4 rounded-3xl bg-muted/30 p-5">
    <div className="flex items-center gap-3">
      <Skeleton className="size-10 shrink-0" />
      <Skeleton className="h-4 w-36" />
    </div>
    <div className="flex flex-col gap-2.5">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
    <Skeleton className="h-8 w-20" />
  </div>
);
