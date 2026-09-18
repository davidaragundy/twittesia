import type { Media } from "@/features/media/types/media";

// An upload the store has confirmed is there, and is what it claims to be, ready to attach
export type ConfirmedMedia = Media & {
  pathname: string;
  size: number;
  position: number;
};
