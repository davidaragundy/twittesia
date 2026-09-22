import { PostSkeleton } from "@/features/posts/components/post-skeleton";

export const FeedSkeleton = () => (
  <div className="flex flex-col gap-2">
    <PostSkeleton />
    <PostSkeleton />
    <PostSkeleton />
  </div>
);
