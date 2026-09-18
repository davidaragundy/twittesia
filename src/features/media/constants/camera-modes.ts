import type { CameraMode } from "@/features/media/types/camera-mode";

export const CAMERA_MODES: { value: CameraMode; label: string }[] = [
  { value: "photo", label: "Photo" },
  { value: "video", label: "Video" },
];
