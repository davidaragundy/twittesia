import { Skeleton } from "@/shared/components/ui/skeleton";

// The chats page as it will arrive: its heading and button, then a few chats
export const ChatsPageSkeleton = () => (
  <div className="flex flex-col gap-10">
    <div className="flex flex-col gap-2">
      <div className="flex min-h-10 items-center justify-between gap-4">
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-9 w-32" />
      </div>
      <Skeleton className="h-4 w-full max-w-sm" />
    </div>

    <div className="flex flex-col gap-3">
      {[0, 1, 2].map((index) => (
        <div key={index} className="flex items-center gap-4 rounded-3xl bg-muted/30 p-4 sm:p-5">
          <Skeleton className="size-12 shrink-0" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3.5 w-24" />
          </div>
          <Skeleton className="size-5" />
        </div>
      ))}
    </div>
  </div>
);
