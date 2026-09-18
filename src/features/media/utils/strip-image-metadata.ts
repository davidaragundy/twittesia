import { tryCatch } from "@/shared/utils/try-catch";

import { REENCODED_IMAGE_QUALITY } from "@/features/media/constants/reencoded-image-quality";
import { REENCODED_IMAGE_TYPES } from "@/features/media/constants/reencoded-image-types";

interface Props {
  file: File;
}

/**
 * Draws an image and encodes it again, so what uploads is its pixels and nothing else. A phone
 * photo carries where it was taken, and on an anonymous network that is the one detail that can
 * point back to a person. The photo is drawn the way it is meant to be seen, so a sideways EXIF
 * orientation is applied rather than lost.
 *
 * Anything else, or an image the browser can't draw, is returned as it is.
 */
export const stripImageMetadata = async ({ file }: Props): Promise<File> => {
  if (!REENCODED_IMAGE_TYPES.includes(file.type)) return file;

  const { data: bitmap, error } = await tryCatch(
    createImageBitmap(file, { imageOrientation: "from-image" }),
  );

  if (error) return file;

  const canvas = document.createElement("canvas");

  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, file.type, REENCODED_IMAGE_QUALITY),
  );

  return blob ? new File([blob], file.name, { type: file.type }) : file;
};
