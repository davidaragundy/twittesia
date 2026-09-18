"use client";

import { Mic01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "cn";

import { Button } from "@/shared/components/ui/button";
import { Spinner } from "@/shared/components/ui/spinner";

import { CaptureErrorMessage } from "@/features/media/components/capture-error-message";
import { MediaAudio } from "@/features/media/components/media-audio";
import { RecordingTimer } from "@/features/media/components/recording-timer";
import { useMicrophoneCapture } from "@/features/media/hooks/use-microphone-capture";

interface Props {
  onCapture: (file: File) => void;
}

export const MicrophoneCapture = ({ onCapture }: Props) => {
  const {
    stream,
    error,
    level,
    capture,
    isRecording,
    elapsed,
    maxSeconds,
    toggleRecording,
    retake,
    use,
  } = useMicrophoneCapture({ onCapture });

  if (capture) {
    return (
      <div className="flex flex-col gap-6">
        <MediaAudio media={capture.media} />
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="lg" onClick={retake}>
            Record again
          </Button>
          <Button size="lg" onClick={use}>
            Use recording
          </Button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center">
        <CaptureErrorMessage error={error} device="microphone" icon={Mic01Icon} />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="relative flex size-40 items-center justify-center">
        {/* Grows with the voice, so it is plain the microphone is listening */}
        <span
          aria-hidden
          className={cn(
            "absolute inset-0 rounded-full transition-transform duration-75",
            isRecording ? "bg-destructive/15" : "bg-primary/10",
          )}
          style={{ transform: `scale(${0.6 + level * 0.4})` }}
        />
        <span className="relative flex size-24 items-center justify-center rounded-full bg-muted text-muted-foreground ring-1 ring-foreground/5">
          {stream ? (
            <HugeiconsIcon icon={Mic01Icon} className="size-9" />
          ) : (
            <Spinner className="size-6" />
          )}
        </span>
      </div>

      <div className="h-6">
        {isRecording ? (
          <RecordingTimer elapsed={elapsed} maxSeconds={maxSeconds} />
        ) : (
          <p className="text-sm text-muted-foreground">Up to {maxSeconds / 60} minutes</p>
        )}
      </div>

      <button
        type="button"
        onClick={toggleRecording}
        disabled={!stream}
        aria-label={isRecording ? "Stop recording" : "Start recording"}
        className="flex size-16 items-center justify-center rounded-full ring-4 ring-foreground/20 transition-transform outline-none hover:scale-105 focus-visible:ring-ring/50 disabled:opacity-50"
      >
        <span
          className={cn(
            "bg-destructive transition-all",
            isRecording ? "size-6 rounded-lg" : "size-12 rounded-full",
          )}
        />
      </button>
    </div>
  );
};
