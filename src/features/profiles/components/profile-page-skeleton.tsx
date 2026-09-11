import { Skeleton } from "@/shared/components/ui/skeleton";

export const ProfilePageSkeleton = () => (
  <div className="flex flex-col items-center gap-8 py-8">
    <Skeleton className="size-10 rounded-full" />

    <div className="flex flex-col items-center gap-2">
      <Skeleton className="h-7 w-40" />
      <Skeleton className="h-5 w-24" />
    </div>

    <div className="flex gap-2">
      <Skeleton className="h-5 w-20 rounded-full" />
      <Skeleton className="h-5 w-20 rounded-full" />
    </div>
  </div>
);
