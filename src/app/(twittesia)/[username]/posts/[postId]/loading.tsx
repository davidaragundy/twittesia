import { BackButton } from "@/shared/components/back-button";
import { Separator } from "@/shared/components/ui/separator";

import { CommentsSkeleton } from "@/features/comments/components/comments-skeleton";
import { PostSkeleton } from "@/features/posts/components/post-skeleton";

// The page as it streams, with a back button that already works
export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <BackButton fallbackHref="/home" label="Back" />
      <div className="-mx-4 sm:-mx-5">
        <PostSkeleton />
      </div>
      <Separator />
      <CommentsSkeleton />
    </div>
  );
}
