import { useEffect, useRef, useState } from "react";

import { tryCatch } from "@/shared/utils/try-catch";

import { useMediaRecorder } from "@/features/media/hooks/use-media-recorder";
import { useMediaStream } from "@/features/media/hooks/use-media-stream";
import type { CameraFacing } from "@/features/media/types/camera-facing";
import type { CameraMode } from "@/features/media/types/camera-mode";
import type { Capture } from "@/features/media/types/capture";
import { capturePhoto } from "@/features/media/utils/capture-photo";
import { toCapture } from "@/features/media/utils/to-capture";

interface Props {
  onCapture: (file: File) => void;
}

export const useCameraCapture = ({ onCapture }: Props) => {
  const previewRef = useRef<HTMLVideoElement>(null);
  const [mode, setMode] = useState<CameraMode>("photo");
  const [facing, setFacing] = useState<CameraFacing>("environment");
  const [capture, setCapture] = useState<Capture | null>(null);
  const [cameraCount, setCameraCount] = useState(0);

  // The microphone is only asked for in video mode, and the camera is off while a capture is
  // being looked at
  const { stream, error } = useMediaStream({
    video: facing,
    audio: mode === "video",
    enabled: !capture,
  });

  const size = () => ({
    width: previewRef.current?.videoWidth || null,
    height: previewRef.current?.videoHeight || null,
  });

  const recorder = useMediaRecorder({
    stream,
    kind: "video",
    onRecorded: (file) => setCapture(toCapture({ file, kind: "video", ...size() })),
  });

  useEffect(() => {
    if (previewRef.current) previewRef.current.srcObject = stream;
  }, [stream]);

  // Labels only appear once a camera is granted, so the count is read after the stream starts
  useEffect(() => {
    if (!stream) return;

    void tryCatch(navigator.mediaDevices.enumerateDevices()).then(({ data }) =>
      setCameraCount(data?.filter((device) => device.kind === "videoinput").length ?? 0),
    );
  }, [stream]);

  useEffect(
    () => () => {
      if (capture) URL.revokeObjectURL(capture.media.url);
    },
    [capture],
  );

  const shoot = async () => {
    if (mode === "video") {
      if (recorder.isRecording) recorder.stop();
      else recorder.start();
      return;
    }

    if (!previewRef.current) return;

    const dimensions = size();
    const file = await capturePhoto({ video: previewRef.current });

    if (file) setCapture(toCapture({ file, kind: "image", ...dimensions }));
  };

  return {
    previewRef,
    mode,
    setMode,
    isMirrored: facing === "user",
    canFlip: cameraCount > 1 && !recorder.isRecording,
    flip: () => setFacing((current) => (current === "user" ? "environment" : "user")),
    stream,
    error,
    capture,
    isRecording: recorder.isRecording,
    elapsed: recorder.elapsed,
    maxSeconds: recorder.maxSeconds,
    shoot,
    retake: () => setCapture(null),
    use: () => capture && onCapture(capture.file),
  };
};
