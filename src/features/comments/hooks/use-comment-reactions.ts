import { useToggleCommentReactionMutation } from "@/features/comments/hooks/use-toggle-comment-reaction-mutation";

interface Props {
  postId: string;
  commentId: string;
}

export const useCommentReactions = ({ postId, commentId }: Props) => {
  const { mutate } = useToggleCommentReactionMutation({ postId });

  return { toggle: (emoji: string) => mutate({ commentId, emoji }) };
};
