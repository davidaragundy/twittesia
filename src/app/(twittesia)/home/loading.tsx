import { FeedSkeleton } from "@/features/posts/components/feed-skeleton";
import { PostComposerSkeleton } from "@/features/posts/components/post-composer-skeleton";

// The same two skeletons the page streams behind, so arriving and loading look alike
export default function Loading() {
  return (
    <div className="flex flex-col gap-10">
      <PostComposerSkeleton />
      <FeedSkeleton />
    </div>
  );
}
