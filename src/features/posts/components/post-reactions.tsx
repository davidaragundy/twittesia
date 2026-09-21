"use client";

import { Reactions } from "@/features/posts/components/reactions";
import { usePostReactions } from "@/features/posts/hooks/use-post-reactions";
import type { FeedPost } from "@/features/posts/types/feed-post";

interface Props {
  post: FeedPost;
  disabled?: boolean;
}

export const PostReactions = ({ post, disabled }: Props) => {
  const { toggle } = usePostReactions({ postId: post.id });

  return <Reactions reactions={post.reactions} onToggle={toggle} disabled={disabled} />;
};
