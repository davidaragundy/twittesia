import type { CommentSort } from "@/features/comments/types/comment-sort";
import type { PostComment } from "@/features/comments/types/post-comment";
import { getCommentScore } from "@/features/comments/utils/get-comment-score";

interface Props {
  comment: PostComment;
  sort: CommentSort;
}

// Points at the last comment of a page, in the terms its order was read in: the score leads when
// the comments are read by popularity, and creation then id settle the comments that tie
export const toCommentCursor = ({ comment, sort }: Props) =>
  sort === "popular"
    ? `${getCommentScore({ comment })}_${comment.createdAt.toISOString()}_${comment.id}`
    : `${comment.createdAt.toISOString()}_${comment.id}`;
