import type { CommentSort } from "@/features/comments/types/comment-sort";
import type { ProfileCommentsPage } from "@/features/comments/types/profile-comments-page";

interface Props {
  username: string;
  cursor: string | null;
  sort: CommentSort;
}

// JSON has no dates, so the timestamps come back as strings
export const fetchProfileCommentsPage = async ({
  username,
  cursor,
  sort,
}: Props): Promise<ProfileCommentsPage> => {
  const params = new URLSearchParams({ sort });

  if (cursor) params.set("cursor", cursor);

  const response = await fetch(`/api/profiles/${encodeURIComponent(username)}/comments?${params}`);

  if (!response.ok) throw new Error("Couldn't load the comments");

  const page: ProfileCommentsPage = await response.json();

  return {
    ...page,
    comments: page.comments.map((item) => ({ ...item, createdAt: new Date(item.createdAt) })),
  };
};
