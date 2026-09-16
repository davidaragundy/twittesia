import { POST_VIEW_BATCH_SIZE } from "@/features/posts/constants/post-view-batch-size";
import { POST_VIEW_MIN_VISIBLE_MS } from "@/features/posts/constants/post-view-min-visible-ms";
import type { PostViewTracker } from "@/features/posts/types/post-view-tracker";
import { sendPostViews } from "@/features/posts/utils/send-post-views";

// Each post counts once per page load; the database keeps it to once per identity overall
export const createPostViewTracker = (): PostViewTracker => {
  const timers = new Map<string, ReturnType<typeof setTimeout>>();
  const pending = new Set<string>();
  const counted = new Set<string>();

  return {
    enter: (postId) => {
      if (counted.has(postId) || timers.has(postId)) return;

      timers.set(
        postId,
        setTimeout(() => {
          timers.delete(postId);
          counted.add(postId);
          pending.add(postId);
        }, POST_VIEW_MIN_VISIBLE_MS),
      );
    },
    leave: (postId) => {
      clearTimeout(timers.get(postId));
      timers.delete(postId);
    },
    flush: ({ isLeaving }) => {
      const postIds = [...pending];
      pending.clear();

      for (let start = 0; start < postIds.length; start += POST_VIEW_BATCH_SIZE) {
        void sendPostViews({
          postIds: postIds.slice(start, start + POST_VIEW_BATCH_SIZE),
          isLeaving,
        });
      }
    },
    dispose: () => {
      for (const timer of timers.values()) clearTimeout(timer);
      timers.clear();
    },
  };
};
