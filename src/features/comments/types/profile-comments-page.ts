import type { ProfileComment } from "@/features/comments/types/profile-comment";

export type ProfileCommentsPage = {
  comments: ProfileComment[];
  // Passed back to read the page after this one; null once there are no more
  nextCursor: string | null;
};
