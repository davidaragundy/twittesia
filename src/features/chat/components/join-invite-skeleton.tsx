import { Skeleton } from "@/shared/components/ui/skeleton";

// An invitation as it will arrive: who sent it, what it is, and the one thing to do
export const JoinInviteSkeleton = () => (
  <div className="my-auto flex w-full max-w-xl flex-col items-center gap-6 self-center rounded-3xl bg-muted/30 px-5 py-12 sm:py-16">
    <Skeleton className="size-20" />

    <div className="flex flex-col items-center gap-2">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-5 w-28" />
    </div>

    <div className="flex w-full max-w-md flex-col items-center gap-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>

    <Skeleton className="h-9 w-48" />
  </div>
);
