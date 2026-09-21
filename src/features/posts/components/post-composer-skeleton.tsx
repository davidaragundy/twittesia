import { Skeleton } from "@/shared/components/ui/skeleton";

// The composer as it will arrive: laid out like a post, avatar, name, then the box to write in
export const PostComposerSkeleton = () => (
  <div className="flex gap-4">
    <Skeleton className="size-10 shrink-0" />
    <div className="flex flex-1 flex-col gap-2">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-32 w-full" />
    </div>
  </div>
);
