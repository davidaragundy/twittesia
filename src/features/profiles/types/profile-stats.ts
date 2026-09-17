// Only what is still alive: everything past its expiry is gone, and is not counted
export type ProfileStats = {
  postCount: number;
  commentCount: number;
  // Reactions other users left on their posts and comments
  reactionCount: number;
  // Users other than them who saw their posts and comments
  viewCount: number;
};
