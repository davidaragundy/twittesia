"use client";

import { useCommentReactions } from "@/features/comments/hooks/use-comment-reactions";
import type { PostComment } from "@/features/comments/types/post-comment";
import { ReactionPicker } from "@/features/posts/components/reaction-picker";

interface Props {
  comment: PostComment;
  disabled?: boolean;
}

export const CommentReactionPicker = ({ comment, disabled }: Props) => {
  const { toggle } = useCommentReactions({ postId: comment.postId, commentId: comment.id });

  return <ReactionPicker reactions={comment.reactions} onToggle={toggle} disabled={disabled} />;
};
