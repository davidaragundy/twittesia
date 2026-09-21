import { Separator } from "@/shared/components/ui/separator";
import { Skeleton } from "@/shared/components/ui/skeleton";

// A chat as it will arrive: who is on the other side, the conversation and the composer
export const ChatRoomSkeleton = () => (
  // Sized like the room, so nothing moves when it arrives
  <div className="-mb-20 flex h-[calc(100svh-7rem)] flex-col gap-4">
    <div className="flex items-center gap-3">
      <Skeleton className="size-10 shrink-0" />
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Skeleton className="hidden h-5 w-24 sm:block" />
        <Skeleton className="h-8 w-28" />
        <Skeleton className="size-8" />
      </div>
    </div>

    <Separator />

    <div className="flex flex-1 flex-col justify-end gap-8 overflow-hidden">
      {/* Runs from alternating sides, so the outline reads as a conversation */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-10 w-48 max-w-[80%]" />
        <Skeleton className="h-10 w-64 max-w-[80%]" />
      </div>
      <div className="flex flex-col items-end gap-2">
        <Skeleton className="h-10 w-40 max-w-[80%]" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-16 w-72 max-w-[80%]" />
      </div>
      <div className="flex flex-col items-end gap-2">
        <Skeleton className="h-10 w-56 max-w-[80%]" />
        <Skeleton className="h-10 w-36 max-w-[80%]" />
      </div>
    </div>

    <Skeleton className="h-24 w-full" />
  </div>
);
