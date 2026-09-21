import { Skeleton } from "@/shared/components/ui/skeleton";

export const PostComposerSkeleton = () => (
  <div className="flex gap-4">
    <Skeleton className="mt-1 size-10 shrink-0" />
    <Skeleton className="h-32 w-full" />
  </div>
);
