import { Skeleton } from "@/shared/components/ui/skeleton";

// The composer as it will arrive: a card with your avatar and name, a line of text, its tools
export const PostComposerSkeleton = () => (
  <div className="flex flex-col gap-4 rounded-3xl bg-muted/30 p-5">
    <div className="flex items-center gap-3">
      <Skeleton className="size-10 shrink-0" />
      <Skeleton className="h-4 w-32" />
    </div>
    <Skeleton className="h-4 w-48" />
    <div className="flex justify-between pt-4">
      <Skeleton className="h-8 w-28" />
      <Skeleton className="h-8 w-16" />
    </div>
  </div>
);
