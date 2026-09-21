"use client";

import { Camera01Icon, CameraRotated01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "cn";
import Image from "next/image";

import { SegmentedControl } from "@/shared/components/segmented-control";
import { Button } from "@/shared/components/ui/button";
import { Spinner } from "@/shared/components/ui/spinner";

import { CaptureErrorMessage } from "@/features/media/components/capture-error-message";
import { MediaVideo } from "@/features/media/components/media-video";
import { RecordingTimer } from "@/features/media/components/recording-timer";
import { CAMERA_MODES } from "@/features/media/constants/camera-modes";
import { useCameraCapture } from "@/features/media/hooks/use-camera-capture";

interface Props {
  onCapture: (file: File) => void;
}

export const CameraCapture = ({ onCapture }: Props) => {
  const {
    previewRef,
    mode,
    setMode,
    isMirrored,
    canFlip,
    flip,
    stream,
    error,
    capture,
    isRecording,
    elapsed,
    maxSeconds,
    shoot,
    retake,
    use,
  } = useCameraCapture({ onCapture });

  return (
    <div className="flex flex-col gap-5">
      <div className="relative flex aspect-3/4 max-h-[55svh] w-full items-center justify-center overflow-hidden rounded-3xl bg-black text-white sm:aspect-video">
        {capture?.media.kind === "image" && (
          <Image
            src={capture.media.url}
            alt="The photo you took"
            fill
            unoptimized
            className="object-contain"
          />
        )}

        {capture?.media.kind === "video" && (
          <MediaVideo media={capture.media} className="size-full rounded-none" />
        )}

        {!capture && (
          <video
            ref={previewRef}
            autoPlay
            playsInline
            muted
            aria-label="Camera preview"
            className={cn(
              "size-full object-cover",
              isMirrored && "-scale-x-100",
              !stream && "hidden",
            )}
          />
        )}

        {!capture && !stream && !error && <Spinner className="absolute size-6" />}

        {!capture && error && (
          <div className="absolute inset-0 flex items-center justify-center bg-background text-foreground">
            <CaptureErrorMessage error={error} device="camera" icon={Camera01Icon} />
          </div>
        )}

        {isRecording && (
          <div className="absolute top-3 left-3 text-foreground">
            <RecordingTimer elapsed={elapsed} maxSeconds={maxSeconds} />
          </div>
        )}
      </div>

      {capture ? (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="lg" onClick={retake}>
            Retake
          </Button>
          <Button size="lg" onClick={use}>
            {capture.media.kind === "image" ? "Use photo" : "Use video"}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-3 items-center">
          <div className="justify-self-start">
            <SegmentedControl
              label="Capture"
              options={CAMERA_MODES}
              value={mode}
              onChange={setMode}
              disabled={isRecording}
            />
          </div>

          <button
            type="button"
            onClick={shoot}
            disabled={!stream}
            aria-label={
              mode === "photo" ? "Take photo" : isRecording ? "Stop recording" : "Record video"
            }
            className="flex size-16 items-center justify-center justify-self-center rounded-full ring-4 ring-foreground/20 transition-transform outline-none hover:scale-105 focus-visible:ring-ring/50 disabled:opacity-50"
          >
            <span
              className={cn(
                "transition-all",
                mode === "photo" && "size-12 rounded-full bg-foreground",
                mode === "video" && !isRecording && "size-12 rounded-full bg-destructive",
                isRecording && "size-6 rounded-lg bg-destructive",
              )}
            />
          </button>

          {canFlip ? (
            <Button
              variant="ghost"
              size="icon-lg"
              onClick={flip}
              aria-label="Switch camera"
              className="justify-self-end"
            >
              <HugeiconsIcon icon={CameraRotated01Icon} className="size-5" />
            </Button>
          ) : (
            <span />
          )}
        </div>
      )}
    </div>
  );
};
