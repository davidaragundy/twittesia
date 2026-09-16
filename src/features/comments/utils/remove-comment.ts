import type { CommentsData } from "@/features/comments/types/comments-data";

interface Props {
  comments: CommentsData | undefined;
  commentId: string;
}

export const removeComment = ({ comments, commentId }: Props): CommentsData | undefined =>
  comments && {
    ...comments,
    pages: comments.pages.map((page) => ({
      ...page,
      comments: page.comments.filter((item) => item.id !== commentId),
    })),
  };
