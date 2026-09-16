import type { CommentsPage } from "@/features/comments/types/comments-page";

interface Props {
  postId: string;
  cursor: string | null;
}

// JSON has no dates, so the timestamps come back as strings
export const fetchCommentsPage = async ({ postId, cursor }: Props): Promise<CommentsPage> => {
  const url = `/api/posts/${encodeURIComponent(postId)}/comments`;
  const response = await fetch(cursor ? `${url}?cursor=${encodeURIComponent(cursor)}` : url);

  if (!response.ok) throw new Error("Couldn't load the comments");

  const page: CommentsPage = await response.json();

  return {
    ...page,
    comments: page.comments.map((item) => ({ ...item, createdAt: new Date(item.createdAt) })),
  };
};
