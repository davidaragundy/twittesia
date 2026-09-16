// What the browser gets of a post.
//
// `author` is null only for posts written before ghosts were removed. Nothing creates an
// authorless post now — leaving deletes its author's posts along with the identity — but those
// rows are around until they expire, so the null case still renders.
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
