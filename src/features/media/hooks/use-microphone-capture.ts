import { useEffect, useState } from "react";

import { useAudioLevel } from "@/features/media/hooks/use-audio-level";
import { useMediaRecorder } from "@/features/media/hooks/use-media-recorder";
import { useMediaStream } from "@/features/media/hooks/use-media-stream";
import type { Capture } from "@/features/media/types/capture";
import { toCapture } from "@/features/media/utils/to-capture";

interface Props {
  onCapture: (file: File) => void;
}

export const useMicrophoneCapture = ({ onCapture }: Props) => {
  const [capture, setCapture] = useState<Capture | null>(null);

  // Off while a recording is being listened to
  const { stream, error } = useMediaStream({ video: false, audio: true, enabled: !capture });
  const level = useAudioLevel({ stream });

  const recorder = useMediaRecorder({
    stream,
    kind: "audio",
    onRecorded: (file) => setCapture(toCapture({ file, kind: "audio" })),
  });

  useEffect(
    () => () => {
      if (capture) URL.revokeObjectURL(capture.media.url);
    },
    [capture],
  );

  return {
    stream,
    error,
    level,
    capture,
    isRecording: recorder.isRecording,
    elapsed: recorder.elapsed,
    maxSeconds: recorder.maxSeconds,
    toggleRecording: recorder.isRecording ? recorder.stop : recorder.start,
    retake: () => setCapture(null),
    use: () => capture && onCapture(capture.file),
  };
};
