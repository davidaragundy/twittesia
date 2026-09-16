import { Skeleton } from "@/shared/components/ui/skeleton";

export const FeedSkeleton = () => (
  <div className="-mx-4 flex flex-col gap-1 sm:-mx-5">
    {[0, 1, 2].map((item) => (
      <div key={item} className="flex gap-4 px-4 py-5 sm:px-5">
        <Skeleton className="size-10 shrink-0 rounded-full" />
        <div className="flex flex-1 flex-col gap-3">
          <Skeleton className="h-4 w-56" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="mt-1 h-8 w-28 rounded-full" />
        </div>
      </div>
    ))}
  </div>
);
