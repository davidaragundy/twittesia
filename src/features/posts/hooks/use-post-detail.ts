import { useRouter } from "next/navigation";

import { usePost } from "@/features/posts/hooks/use-post";
import { usePostViewTracking } from "@/features/posts/hooks/use-post-view-tracking";
import type { FeedPost } from "@/features/posts/types/feed-post";

interface Props {
  initialPost: FeedPost;
}

export const usePostDetail = ({ initialPost }: Props) => {
  const router = useRouter();
  const { post } = usePost({ initialPost });
  const { containerRef } = usePostViewTracking({ postIds: [post.id] });

  // Nothing is left to show once the post is gone
  return { post, containerRef, onDeleted: () => router.replace("/home") };
};
