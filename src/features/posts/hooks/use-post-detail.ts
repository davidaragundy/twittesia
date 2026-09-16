import { useRouter } from "next/navigation";

import { POST_VIEWS_URL } from "@/features/posts/constants/post-views-url";
import { usePost } from "@/features/posts/hooks/use-post";
import { useViewTracking } from "@/features/posts/hooks/use-view-tracking";
import type { FeedPost } from "@/features/posts/types/feed-post";

interface Props {
  initialPost: FeedPost;
}

export const usePostDetail = ({ initialPost }: Props) => {
  const router = useRouter();
  const { post } = usePost({ initialPost });
  const { containerRef } = useViewTracking({ ids: [post.id], url: POST_VIEWS_URL });

  // Nothing is left to show once the post is gone
  return { post, containerRef, onDeleted: () => router.replace("/home") };
};
