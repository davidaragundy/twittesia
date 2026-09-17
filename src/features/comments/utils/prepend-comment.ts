import type { CommentsData } from "@/features/comments/types/comments-data";
import type { PostComment } from "@/features/comments/types/post-comment";

interface Props {
  comments: CommentsData | undefined;
  comment: PostComment;
}

export const prependComment = ({ comments, comment }: Props): CommentsData | undefined =>
  comments && {
    ...comments,
    pages: comments.pages.map((page, index) =>
      index === 0 ? { ...page, comments: [comment, ...page.comments] } : page,
    ),
  };
