import { useEffect, useRef, useState } from "react";

import { RECORDING_RULES } from "@/features/media/constants/recording-rules";
import type { RecordingKind } from "@/features/media/types/recording-kind";
import { pickRecordingMimeType } from "@/features/media/utils/pick-recording-mime-type";
import { toRecordingFile } from "@/features/media/utils/to-recording-file";

interface Props {
  stream: MediaStream | null;
  kind: RecordingKind;
  onRecorded: (file: File) => void;
}

// Records a live stream into a file, and stops by itself at its kind's cap, so a recording always
// fits the upload limit
export const useMediaRecorder = ({ stream, kind, onRecorded }: Props) => {
  const recorderRef = useRef<MediaRecorder | null>(null);
  const startedAtRef = useRef(0);
  const [isRecording, setIsRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const { maxSeconds, bitsPerSecond } = RECORDING_RULES[kind];

  const stop = () => {
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
  };

  const start = () => {
    if (!stream || isRecording) return;

    const recorder = new MediaRecorder(stream, {
      mimeType: pickRecordingMimeType({ kind }),
      bitsPerSecond,
    });
    const chunks: Blob[] = [];

    recorder.ondataavailable = (event) => {
      if (event.data.size) chunks.push(event.data);
    };
    recorder.onstop = () => {
      setIsRecording(false);
      onRecorded(toRecordingFile({ chunks, mimeType: recorder.mimeType, name: kind }));
    };

    recorderRef.current = recorder;
    startedAtRef.current = Date.now();
    setElapsed(0);
    setIsRecording(true);
    recorder.start();
  };

  useEffect(() => {
    if (!isRecording) return;

    const timer = setInterval(() => {
      const seconds = (Date.now() - startedAtRef.current) / 1_000;

      setElapsed(Math.min(seconds, maxSeconds));

      if (seconds >= maxSeconds && recorderRef.current?.state === "recording") {
        recorderRef.current.stop();
      }
    }, 200);

    return () => clearInterval(timer);
  }, [isRecording, maxSeconds]);

  // Closed mid-recording: whatever was recorded is thrown away, never attached
  useEffect(
    () => () => {
      const recorder = recorderRef.current;

      if (recorder?.state !== "recording") return;

      recorder.onstop = null;
      recorder.stop();
    },
    [],
  );

  return { isRecording, elapsed, maxSeconds, start, stop };
};
