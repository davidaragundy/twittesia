export type PostViewTracker = {
  // The post became visible enough to start counting
  enter: (postId: string) => void;
  // It stopped being visible enough, so a view not yet counted is dropped
  leave: (postId: string) => void;
  flush: (options: { isLeaving: boolean }) => void;
  dispose: () => void;
};
