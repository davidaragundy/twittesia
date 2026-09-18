import type { MediaKind } from "@/features/media/types/media-kind";

// What the browser gets of a file attached to a post or a comment
export type Media = {
  id: string;
  kind: MediaKind;
  url: string;
  contentType: string;
  // Known for images and video, to hold their space before they load
  width: number | null;
  height: number | null;
};
