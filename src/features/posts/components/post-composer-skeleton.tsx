import { Skeleton } from "@/shared/components/ui/skeleton";

// The composer as it will arrive, drawn like a post: avatar, name, a line of text, its tools
export const PostComposerSkeleton = () => (
  <div className="flex gap-4">
    <Skeleton className="size-10 shrink-0" />
    <div className="flex flex-1 flex-col gap-3 pt-1">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-4 w-48" />
      <div className="flex justify-between pt-4">
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  </div>
);
