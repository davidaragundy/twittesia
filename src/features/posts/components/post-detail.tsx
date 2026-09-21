"use client";

import { PostItem } from "@/features/posts/components/post-item";
import { usePostDetail } from "@/features/posts/hooks/use-post-detail";
import type { FeedPost } from "@/features/posts/types/feed-post";

interface Props {
  initialPost: FeedPost;
}

export const PostDetail = ({ initialPost }: Props) => {
  const { post, containerRef, onDeleted } = usePostDetail({ initialPost });

  return (
    <div ref={containerRef}>
      <PostItem post={post} position={1} total={1} onDeleted={onDeleted} />
    </div>
  );
};
