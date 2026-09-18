import { nanoid } from "nanoid";

import type { Capture } from "@/features/media/types/capture";
import type { MediaKind } from "@/features/media/types/media-kind";

interface Props {
  file: File;
  kind: MediaKind;
  width?: number | null;
  height?: number | null;
}

export const toCapture = ({ file, kind, width = null, height = null }: Props): Capture => ({
  file,
  media: {
    id: nanoid(),
    kind,
    url: URL.createObjectURL(file),
    contentType: file.type,
    width,
    height,
  },
});
