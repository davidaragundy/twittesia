import { tryCatch } from "@/shared/utils/try-catch";

import { POST_VIEWS_URL } from "@/features/posts/constants/post-views-url";

interface Props {
  postIds: string[];
  // A page being hidden may never get a fetch response, but the browser delivers a beacon
  isLeaving: boolean;
}

// Views are best effort: a batch that fails is not retried
export const sendPostViews = async ({ postIds, isLeaving }: Props) => {
  const body = JSON.stringify({ postIds });

  if (
    isLeaving &&
    navigator.sendBeacon(POST_VIEWS_URL, new Blob([body], { type: "application/json" }))
  ) {
    return;
  }

  await tryCatch(
    fetch(POST_VIEWS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }),
  );
};
