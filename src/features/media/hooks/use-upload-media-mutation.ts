import { useMutation } from "@tanstack/react-query";
import { uploadPresigned } from "@vercel/blob/client";
import { useState } from "react";
import { toast } from "sonner";

import { MEDIA_UPLOAD_URL } from "@/features/media/constants/media-upload-url";
import type { MediaDraft } from "@/features/media/types/media-draft";
import type { MediaUpload } from "@/features/media/types/media-upload";
import { toMediaPathname } from "@/features/media/utils/to-media-pathname";

/**
 * Sends a composer's files straight from the browser to Blob, each one authorised first by the
 * upload route. Nothing goes up until the post or comment is sent, so a draft that is abandoned
 * spends none of the plan's monthly uploads.
 */
export const useUploadMediaMutation = () => {
  // Percent sent, by draft
  const [progress, setProgress] = useState<Record<string, number>>({});

  const mutation = useMutation({
    mutationFn: (drafts: MediaDraft[]) =>
      Promise.all(
        drafts.map(async (draft): Promise<MediaUpload> => {
          const pathname = toMediaPathname({ kind: draft.kind, contentType: draft.file.type });

          await uploadPresigned(pathname, draft.file, {
            access: "public",
            handleUploadUrl: MEDIA_UPLOAD_URL,
            clientPayload: draft.kind,
            contentType: draft.file.type,
            onUploadProgress: ({ percentage }) =>
              setProgress((current) => ({ ...current, [draft.id]: percentage })),
          });

          return { pathname, width: draft.width, height: draft.height };
        }),
      ),
    onError: () => {
      toast.error("Couldn't upload your files", { description: "Please try again in a moment." });
    },
    onSettled: () => setProgress({}),
  });

  return { ...mutation, progress };
};
