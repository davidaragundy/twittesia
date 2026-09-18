import { useRef } from "react";

import { tryCatch } from "@/shared/utils/try-catch";

import { useMediaPlayback } from "@/features/media/hooks/use-media-playback";

export const useMediaVideo = () => {
  const playback = useMediaPlayback<HTMLVideoElement>();
  const containerRef = useRef<HTMLDivElement>(null);

  // The whole player goes full screen, controls included; iOS only lets the video itself, with
  // its own controls
  const enterFullscreen = () => {
    const container = containerRef.current;
    const video = playback.mediaRef.current as
      | (HTMLVideoElement & { webkitEnterFullscreen?: () => void })
      | null;

    if (container?.requestFullscreen) void tryCatch(container.requestFullscreen());
    else video?.webkitEnterFullscreen?.();
  };

  return { ...playback, containerRef, enterFullscreen };
};
