// How tall or wide a lone image or video may be drawn: portraits no taller than 4:5, panoramas no
// wider than 1.91:1, so one file never takes over the feed or shrinks to a strip
export const MEDIA_ASPECT_RATIO_RANGE = { min: 4 / 5, max: 1.91, fallback: 16 / 9 };
