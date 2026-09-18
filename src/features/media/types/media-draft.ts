import type { MediaKind } from "@/features/media/types/media-kind";

// A file chosen in a composer, shown from the device until it is sent
export type MediaDraft = {
  id: string;
  file: File;
  kind: MediaKind;
  previewUrl: string;
  width: number | null;
  height: number | null;
};
