import type { CaptureError } from "@/features/media/types/capture-error";

export const CAPTURE_ERROR_COPY: Record<
  CaptureError,
  { title: string; description: (device: string) => string }
> = {
  unsupported: {
    title: "Not available here",
    description: (device) => `This browser can't use your ${device} on this page.`,
  },
  blocked: {
    title: "Access is blocked",
    description: (device) =>
      `Allow Twittesia to use your ${device} in your browser's site settings, then try again.`,
  },
  missing: {
    title: "Nothing found",
    description: (device) => `No ${device} is connected to this device.`,
  },
  failed: {
    title: "Couldn't start",
    description: (device) =>
      `Your ${device} didn't start. Close anything else using it and try again.`,
  },
};
