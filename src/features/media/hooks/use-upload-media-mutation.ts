import { useMutation } from "@tanstack/react-query";
import { upload } from "@upstash/blob/browser";
import { useState } from "react";
import { toast } from "sonner";

import { MEDIA_UPLOAD_URL } from "@/features/media/constants/media-upload-url";
import type { MediaDraft } from "@/features/media/types/media-draft";
import type { MediaUpload } from "@/features/media/types/media-upload";

/**
 * Sends a composer's files straight from the browser to the bucket, each one authorised first by
 * the upload route for its kind, which also names its path. Nothing goes up until the post or
 * comment is sent, so a draft that is abandoned spends none of the plan's monthly uploads.
 */
export const useUploadMediaMutation = () => {
  // Percent sent, by draft
  const [progress, setProgress] = useState<Record<string, number>>({});

  const mutation = useMutation({
    mutationFn: (drafts: MediaDraft[]) =>
      Promise.all(
        drafts.map(async (draft): Promise<MediaUpload> => {
          const task = upload(draft.file, { route: `${MEDIA_UPLOAD_URL}?route=${draft.kind}` });
          const unsubscribe = task.subscribe(() =>
            setProgress((current) => ({ ...current, [draft.id]: task.snapshot().percent })),
          );

          const blob = await task.done.finally(unsubscribe);

          return { pathname: blob.path, width: draft.width, height: draft.height };
        }),
      ),
    onError: () => {
      toast.error("Couldn't upload your files", { description: "Please try again in a moment." });
    },
    onSettled: () => setProgress({}),
  });

  return { ...mutation, progress };
};
