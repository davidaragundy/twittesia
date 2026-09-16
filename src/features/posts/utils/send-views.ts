import { tryCatch } from "@/shared/utils/try-catch";

interface Props {
  url: string;
  ids: string[];
  // A page being hidden may never get a fetch response, but the browser delivers a beacon
  isLeaving: boolean;
}

// Views are best effort: a batch that fails is not retried
export const sendViews = async ({ url, ids, isLeaving }: Props) => {
  const body = JSON.stringify({ ids });

  if (isLeaving && navigator.sendBeacon(url, new Blob([body], { type: "application/json" }))) {
    return;
  }

  await tryCatch(
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }),
  );
};
