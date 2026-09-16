import { PostSkeleton } from "@/features/posts/components/post-skeleton";

export const FeedSkeleton = () => (
  <div className="-mx-4 flex flex-col gap-1 sm:-mx-5">
    <PostSkeleton />
    <PostSkeleton />
    <PostSkeleton />
  </div>
);
