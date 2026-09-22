import { Skeleton } from "@/shared/components/ui/skeleton";

export function IdentityCardSkeleton() {
  return (
    <div className="flex flex-col gap-5 rounded-3xl bg-muted/30 p-5">
      <div className="flex items-center gap-3">
        <Skeleton className="size-10" />
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3.5 w-36" />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Skeleton className="size-10" />
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3.5 w-28" />
        </div>
      </div>
    </div>
  );
}
