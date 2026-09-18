// What a file is attached to: a post or a comment, never both
export type MediaOwner =
  | { postId: string; commentId?: never }
  | { commentId: string; postId?: never };
