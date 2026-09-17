import type { PostComment } from "@/features/comments/types/post-comment";

export type ProfileComment = PostComment & {
  // Whoever wrote the post it was left on, so the comment can link back to it; null for a post
  // written before ghosts were removed
  postAuthorUsername: string | null;
};
