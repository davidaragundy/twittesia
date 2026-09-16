import { useEffect, useRef } from "react";

import { VIEW_FLUSH_INTERVAL_MS } from "@/features/posts/constants/view-flush-interval-ms";
import { VIEW_MIN_VISIBLE_RATIO } from "@/features/posts/constants/view-min-visible-ratio";
import { createViewTracker } from "@/features/posts/utils/create-view-tracker";

interface Props {
  // Changes whenever items are added, so the new ones start being watched
  ids: string[];
  // The endpoint that records views of these items
  url: string;
}

// Watches every element inside the returned ref that carries data-view-id; one marked
// data-view-mine is the reader's own and never counts
export const useViewTracking = ({ ids, url }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const tracker = createViewTracker({ url });

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const { viewId, viewMine } = (entry.target as HTMLElement).dataset;

          if (!viewId || viewMine === "true") continue;

          if (entry.intersectionRatio >= VIEW_MIN_VISIBLE_RATIO) tracker.enter(viewId);
          else tracker.leave(viewId);
        }
      },
      { threshold: VIEW_MIN_VISIBLE_RATIO },
    );
    observerRef.current = observer;

    const interval = setInterval(() => tracker.flush({ isLeaving: false }), VIEW_FLUSH_INTERVAL_MS);

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") tracker.flush({ isLeaving: true });
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      observer.disconnect();
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      tracker.flush({ isLeaving: true });
      tracker.dispose();
    };
  }, [url]);

  useEffect(() => {
    // Observing an element already observed does nothing, so earlier items keep their timers
    for (const element of containerRef.current?.querySelectorAll("[data-view-id]") ?? []) {
      observerRef.current?.observe(element);
    }
  }, [ids]);

  return { containerRef };
};
