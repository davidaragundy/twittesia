import type { CommentsData } from "@/features/comments/types/comments-data";
import type { PostComment } from "@/features/comments/types/post-comment";

interface Props {
  comments: CommentsData | undefined;
  comment: PostComment;
}

// Only when every page is loaded: otherwise the page it belongs to arrives with it anyway
export const appendComment = ({ comments, comment }: Props): CommentsData | undefined => {
  const last = comments?.pages.at(-1);

  if (!comments || !last || last.nextCursor) return comments;

  return {
    ...comments,
    pages: [...comments.pages.slice(0, -1), { ...last, comments: [...last.comments, comment] }],
  };
};
