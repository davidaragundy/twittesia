import type { MediaKind } from "@/features/media/types/media-kind";

// Who may attach an authorised upload and what kind of file it may be, and, once it has landed in
// the bucket, what was actually stored
export type UploadClaim = {
  uploaderId: string;
  kind: MediaKind;
  landed?: { url: string; contentType: string; size: number };
};
