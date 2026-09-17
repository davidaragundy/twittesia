import type { CommentSort } from "@/features/comments/types/comment-sort";
import type { CommentsPage } from "@/features/comments/types/comments-page";

interface Props {
  postId: string;
  cursor: string | null;
  sort: CommentSort;
}

// JSON has no dates, so the timestamps come back as strings
export const fetchCommentsPage = async ({ postId, cursor, sort }: Props): Promise<CommentsPage> => {
  const params = new URLSearchParams({ sort });

  if (cursor) params.set("cursor", cursor);

  const response = await fetch(`/api/posts/${encodeURIComponent(postId)}/comments?${params}`);

  if (!response.ok) throw new Error("Couldn't load the comments");

  const page: CommentsPage = await response.json();

  return {
    ...page,
    comments: page.comments.map((item) => ({ ...item, createdAt: new Date(item.createdAt) })),
  };
};
