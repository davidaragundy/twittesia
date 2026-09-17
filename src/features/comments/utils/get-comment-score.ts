import type { PostComment } from "@/features/comments/types/post-comment";

interface Props {
  comment: PostComment;
}

// The same score the database orders by, so a cursor points where the order left off
export const getCommentScore = ({ comment }: Props) =>
  comment.reactions.reduce((total, reaction) => total + reaction.count, 0);
