export type ViewTracker = {
  // The item became visible enough to start counting
  enter: (id: string) => void;
  // It stopped being visible enough, so a view not yet counted is dropped
  leave: (id: string) => void;
  flush: (options: { isLeaving: boolean }) => void;
  dispose: () => void;
};
