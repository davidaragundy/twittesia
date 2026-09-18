import { REENCODED_IMAGE_QUALITY } from "@/features/media/constants/reencoded-image-quality";

interface Props {
  video: HTMLVideoElement;
}

// The camera's current frame as a JPEG, the way the camera sees it: the preview of a front camera
// is mirrored so it feels like a mirror, but the photo is not
export const capturePhoto = async ({ video }: Props): Promise<File | null> => {
  const canvas = document.createElement("canvas");

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d")?.drawImage(video, 0, 0);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", REENCODED_IMAGE_QUALITY),
  );

  return blob ? new File([blob], `photo-${Date.now()}.jpg`, { type: "image/jpeg" }) : null;
};
