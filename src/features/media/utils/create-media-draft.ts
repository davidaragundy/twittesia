import { generateId } from "@/shared/utils/generate-id";

import { BYTES_PER_MEGABYTE } from "@/features/media/constants/bytes-per-megabyte";
import { MEDIA_RULES } from "@/features/media/constants/media-rules";
import type { MediaDraft } from "@/features/media/types/media-draft";
import { getMediaKind } from "@/features/media/utils/get-media-kind";
import { readMediaDimensions } from "@/features/media/utils/read-media-dimensions";
import { stripImageMetadata } from "@/features/media/utils/strip-image-metadata";

interface Props {
  file: File;
}

// A chosen file, checked before anything is uploaded: the same rules the upload route enforces,
// so a file that would be refused is refused here, with a reason
export const createMediaDraft = async ({
  file: chosen,
}: Props): Promise<{ draft: MediaDraft; error: null } | { draft: null; error: string }> => {
  const kind = getMediaKind({ contentType: chosen.type });

  if (!kind) {
    return {
      draft: null,
      error: `${chosen.name} isn't an image, a video or an audio file we support`,
    };
  }

  // Before the size is checked, since the file that uploads is the one without its metadata
  const file = await stripImageMetadata({ file: chosen });

  const { maxBytes } = MEDIA_RULES[kind];

  if (file.size > maxBytes) {
    return {
      draft: null,
      error: `${file.name} is over the ${maxBytes / BYTES_PER_MEGABYTE} MB limit for ${kind === "audio" ? "audio" : `${kind}s`}`,
    };
  }

  const previewUrl = URL.createObjectURL(file);
  const { width, height } = await readMediaDimensions({ kind, previewUrl });

  return { draft: { id: generateId(), file, kind, previewUrl, width, height }, error: null };
};
