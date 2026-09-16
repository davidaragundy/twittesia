import type { Reaction } from "@/features/posts/types/reaction";

// What the browser gets of a comment
export type PostComment = {
  id: string;
  postId: string;
  content: string;
  createdAt: Date;
  author: {
    name: string;
    username: string;
    displayUsername: string;
  };
  // Whether the reader wrote it, and so can delete it
  isMine: boolean;
  reactions: Reaction[];
  // Users other than the author who saw it
  viewCount: number;
};
