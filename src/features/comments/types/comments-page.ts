import type { PostComment } from "@/features/comments/types/post-comment";

export type CommentsPage = {
  comments: PostComment[];
  // Passed back to read the page after this one; null once there are no more
  nextCursor: string | null;
};
