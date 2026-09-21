"use client";

import { ReactionPicker } from "@/features/posts/components/reaction-picker";
import { usePostReactions } from "@/features/posts/hooks/use-post-reactions";
import type { FeedPost } from "@/features/posts/types/feed-post";

interface Props {
  post: FeedPost;
  disabled?: boolean;
}

export const PostReactionPicker = ({ post, disabled }: Props) => {
  const { toggle } = usePostReactions({ postId: post.id });

  return <ReactionPicker reactions={post.reactions} onToggle={toggle} disabled={disabled} />;
};
