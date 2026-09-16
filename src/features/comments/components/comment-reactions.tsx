"use client";

import { useCommentReactions } from "@/features/comments/hooks/use-comment-reactions";
import type { PostComment } from "@/features/comments/types/post-comment";
import { Reactions } from "@/features/posts/components/reactions";

interface Props {
  comment: PostComment;
}

export const CommentReactions = ({ comment }: Props) => {
  const { toggle } = useCommentReactions({ postId: comment.postId, commentId: comment.id });

  return <Reactions reactions={comment.reactions} onToggle={toggle} />;
};
