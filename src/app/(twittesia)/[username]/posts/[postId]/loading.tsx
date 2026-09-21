import { BackButton } from "@/shared/components/back-button";

import { CommentsSkeleton } from "@/features/comments/components/comments-skeleton";
import { PostSkeleton } from "@/features/posts/components/post-skeleton";

// The page as it streams, with a back button that already works
export default function Loading() {
  return (
    <div className="flex flex-col gap-10">
      <BackButton fallbackHref="/home" label="Back" />
      <PostSkeleton />
      <CommentsSkeleton />
    </div>
  );
}
