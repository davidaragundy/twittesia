import { Skeleton } from "@/shared/components/ui/skeleton";

export const CommentsSkeleton = () => (
  <div className="flex flex-col gap-8">
    <Skeleton className="h-6 w-28" />
    <Skeleton className="h-24 w-full" />
  </div>
);
