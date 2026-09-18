import { useEffect, useState } from "react";

import { tryCatch } from "@/shared/utils/try-catch";

import type { CameraFacing } from "@/features/media/types/camera-facing";
import type { CaptureError } from "@/features/media/types/capture-error";
import { toCaptureError } from "@/features/media/utils/to-capture-error";

interface Props {
  // Which camera, or none
  video: CameraFacing | false;
  audio: boolean;
  // Off turns the devices off: their lights go out the moment nothing needs them
  enabled: boolean;
}

// A live camera or microphone, asked for when it is needed and released as soon as it isn't
export const useMediaStream = ({ video, audio, enabled }: Props) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<CaptureError | null>(null);

  useEffect(() => {
    if (!enabled) return;

    if (!navigator.mediaDevices?.getUserMedia) {
      setError("unsupported");
      return;
    }

    let isCurrent = true;
    let acquired: MediaStream | null = null;

    setError(null);

    void tryCatch(
      navigator.mediaDevices.getUserMedia({
        video: video ? { facingMode: video } : false,
        audio,
      }),
    ).then(({ data, error: requestError }) => {
      // Asked for something else, or closed, while the browser was answering
      if (!isCurrent) {
        data?.getTracks().forEach((track) => track.stop());
        return;
      }

      if (requestError) {
        setError(toCaptureError({ error: requestError }));
        return;
      }

      acquired = data;
      setStream(data);
    });

    return () => {
      isCurrent = false;
      acquired?.getTracks().forEach((track) => track.stop());
      setStream(null);
    };
  }, [video, audio, enabled]);

  return { stream, error };
};
