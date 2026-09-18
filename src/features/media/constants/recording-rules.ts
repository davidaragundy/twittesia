// How long a recording may run, and how densely it is encoded: at these rates the longest
// recording still fits the size limit of its kind, 25 MB for video and 10 MB for audio. The
// types are tried in order: MP4 plays in every browser, so it is preferred wherever the browser
// can record it, and WebM is the fallback.
export const RECORDING_RULES = {
  video: {
    maxSeconds: 60,
    bitsPerSecond: 2_500_000,
    mimeTypes: [
      "video/mp4;codecs=avc1,mp4a",
      "video/mp4",
      "video/webm;codecs=vp9,opus",
      "video/webm;codecs=vp8,opus",
      "video/webm",
    ],
  },
  audio: {
    maxSeconds: 300,
    bitsPerSecond: 128_000,
    mimeTypes: ["audio/mp4;codecs=mp4a", "audio/mp4", "audio/webm;codecs=opus", "audio/webm"],
  },
} as const;
