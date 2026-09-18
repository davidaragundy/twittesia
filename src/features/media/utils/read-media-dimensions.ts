import type { MediaKind } from "@/features/media/types/media-kind";

interface Props {
  kind: MediaKind;
  previewUrl: string;
}

// The size an image or a video will take on screen, so its space is held before it loads. A file
// the browser can't read reports none, and still uploads.
export const readMediaDimensions = ({
  kind,
  previewUrl,
}: Props): Promise<{ width: number | null; height: number | null }> =>
  new Promise((resolve) => {
    const none = { width: null, height: null };

    if (kind === "image") {
      const image = new Image();

      image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight });
      image.onerror = () => resolve(none);
      image.src = previewUrl;
      return;
    }

    if (kind === "video") {
      const video = document.createElement("video");

      video.preload = "metadata";
      video.onloadedmetadata = () =>
        resolve(video.videoWidth ? { width: video.videoWidth, height: video.videoHeight } : none);
      video.onerror = () => resolve(none);
      video.src = previewUrl;
      return;
    }

    resolve(none);
  });
