import { VIEW_BATCH_SIZE } from "@/features/posts/constants/view-batch-size";
import { VIEW_MIN_VISIBLE_MS } from "@/features/posts/constants/view-min-visible-ms";
import type { ViewTracker } from "@/features/posts/types/view-tracker";
import { sendViews } from "@/features/posts/utils/send-views";

interface Props {
  // Where the batches go: posts and comments each record views at their own endpoint
  url: string;
}

// Each item counts once per page load; the database keeps it to once per identity overall
export const createViewTracker = ({ url }: Props): ViewTracker => {
  const timers = new Map<string, ReturnType<typeof setTimeout>>();
  const pending = new Set<string>();
  const counted = new Set<string>();

  return {
    enter: (id) => {
      if (counted.has(id) || timers.has(id)) return;

      timers.set(
        id,
        setTimeout(() => {
          timers.delete(id);
          counted.add(id);
          pending.add(id);
        }, VIEW_MIN_VISIBLE_MS),
      );
    },
    leave: (id) => {
      clearTimeout(timers.get(id));
      timers.delete(id);
    },
    flush: ({ isLeaving }) => {
      const ids = [...pending];
      pending.clear();

      for (let start = 0; start < ids.length; start += VIEW_BATCH_SIZE) {
        void sendViews({ url, ids: ids.slice(start, start + VIEW_BATCH_SIZE), isLeaving });
      }
    },
    dispose: () => {
      for (const timer of timers.values()) clearTimeout(timer);
      timers.clear();
    },
  };
};
