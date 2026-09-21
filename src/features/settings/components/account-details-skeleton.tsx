import { Skeleton } from "@/shared/components/ui/skeleton";

// The two fields of the account section: a label, the field and the line under it
export const AccountDetailsSkeleton = () => (
  <div className="flex flex-col gap-7">
    {[0, 1].map((index) => (
      <div key={index} className="flex flex-col gap-3">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    ))}
  </div>
);
