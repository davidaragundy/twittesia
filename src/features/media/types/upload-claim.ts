import type { MediaKind } from "@/features/media/types/media-kind";

// Who may attach an authorised upload, and what kind of file it may be
export type UploadClaim = {
  uploaderId: string;
  kind: MediaKind;
};
