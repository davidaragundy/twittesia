import type { Media } from "@/features/media/types/media";

// Something just taken or recorded, shown from the device until it is used or retaken
export type Capture = {
  file: File;
  // The same file, shaped for the app's own players
  media: Media;
};
