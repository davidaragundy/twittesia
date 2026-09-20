import { Skeleton } from "@/shared/components/ui/skeleton";

export const PostComposerSkeleton = () => (
  <div className="flex gap-4">
    <Skeleton shape="round" className="mt-1 hidden size-10 shrink-0 sm:block" />
    <Skeleton shape="field" className="h-32 w-full" />
  </div>
);
