import type { PostComment } from "@/features/comments/types/post-comment";

// Points at the last comment of a page: comments are ordered by creation, then by id
export const toCommentCursor = ({ createdAt, id }: Pick<PostComment, "createdAt" | "id">) =>
  `${createdAt.toISOString()}_${id}`;
