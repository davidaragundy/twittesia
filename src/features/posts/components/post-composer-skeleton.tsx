import { Skeleton } from "@/shared/components/ui/skeleton";

export const PostComposerSkeleton = () => (
  <div className="flex gap-4">
    <Skeleton className="mt-1 hidden size-10 shrink-0 rounded-full sm:block" />
    <Skeleton className="h-32 w-full rounded-4xl" />
  </div>
);
