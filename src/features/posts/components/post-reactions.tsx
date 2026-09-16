"use client";

import { Reactions } from "@/features/posts/components/reactions";
import { usePostReactions } from "@/features/posts/hooks/use-post-reactions";
import type { FeedPost } from "@/features/posts/types/feed-post";

interface Props {
  post: FeedPost;
}

export const PostReactions = ({ post }: Props) => {
  const { toggle } = usePostReactions({ postId: post.id });

  return <Reactions reactions={post.reactions} onToggle={toggle} />;
};
