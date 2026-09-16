import { useEffect, useRef } from "react";

import { POST_VIEW_FLUSH_INTERVAL_MS } from "@/features/posts/constants/post-view-flush-interval-ms";
import { POST_VIEW_MIN_VISIBLE_RATIO } from "@/features/posts/constants/post-view-min-visible-ratio";
import { createPostViewTracker } from "@/features/posts/utils/create-post-view-tracker";

interface Props {
  // Changes whenever posts are added, so the new ones start being watched
  postIds: string[];
}

// Watches every element inside the returned ref that carries data-post-id
export const usePostViewTracking = ({ postIds }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const tracker = createPostViewTracker();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const { postId, isMine } = (entry.target as HTMLElement).dataset;

          if (!postId || isMine === "true") continue;

          if (entry.intersectionRatio >= POST_VIEW_MIN_VISIBLE_RATIO) tracker.enter(postId);
          else tracker.leave(postId);
        }
      },
      { threshold: POST_VIEW_MIN_VISIBLE_RATIO },
    );
    observerRef.current = observer;

    const interval = setInterval(
      () => tracker.flush({ isLeaving: false }),
      POST_VIEW_FLUSH_INTERVAL_MS,
    );

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
  }, []);

  useEffect(() => {
    // Observing an element already observed does nothing, so earlier posts keep their timers
    for (const element of containerRef.current?.querySelectorAll("[data-post-id]") ?? []) {
      observerRef.current?.observe(element);
    }
  }, [postIds]);

  return { containerRef };
};
