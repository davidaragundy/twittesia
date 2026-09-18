// Image types the browser can draw and encode again, which leaves behind everything but the
// pixels: the location a photo was taken, the device, the time. GIF would lose its animation and
// not every browser can encode AVIF, so both go up as they are.
export const REENCODED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
