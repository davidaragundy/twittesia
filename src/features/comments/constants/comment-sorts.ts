import type { CommentSort } from "@/features/comments/types/comment-sort";

// The orders a post's comments can be read in, as the switch above them offers them
export const COMMENT_SORTS: { value: CommentSort; label: string }[] = [
  { value: "latest", label: "Latest" },
  { value: "popular", label: "Most popular" },
];
