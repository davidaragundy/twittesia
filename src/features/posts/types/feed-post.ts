// What the browser gets of a post. A ghost has no author, so nothing ties it to whoever wrote it.
export type FeedPost = {
  id: string;
  content: string;
  createdAt: Date;
  author: {
    name: string;
    username: string;
    displayUsername: string;
    image: string | null;
  } | null;
  // Whether the reader wrote it, and so can delete it
  isMine: boolean;
};
