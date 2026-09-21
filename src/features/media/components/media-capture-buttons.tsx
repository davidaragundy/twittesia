"use client";

import { Camera01Icon, Mic01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { InputGroupButton } from "@/shared/components/ui/input-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/tooltip";

import { CameraCapture } from "@/features/media/components/camera-capture";
import { MediaCaptureShell } from "@/features/media/components/media-capture-shell";
import { MicrophoneCapture } from "@/features/media/components/microphone-capture";
import { useMediaCaptureButtons } from "@/features/media/hooks/use-media-capture-buttons";

interface Props {
  // Takes what was captured the way the file picker takes what was chosen
  onCapture: (files: File[]) => void;
  disabled?: boolean;
}

export const MediaCaptureButtons = ({ onCapture, disabled }: Props) => {
  const { open, openCamera, openMicrophone, onOpenChange, capture } = useMediaCaptureButtons({
    onCapture,
  });

  return (
    <>
      <Tooltip>
        <TooltipTrigger
          render={
            <InputGroupButton
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={openCamera}
              disabled={disabled}
              aria-label="Take a photo or video"
            />
          }
        >
          <HugeiconsIcon icon={Camera01Icon} />
        </TooltipTrigger>
        <TooltipContent>Take a photo or video</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger
          render={
            <InputGroupButton
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={openMicrophone}
              disabled={disabled}
              aria-label="Record audio"
            />
          }
        >
          <HugeiconsIcon icon={Mic01Icon} />
        </TooltipTrigger>
        <TooltipContent>Record audio</TooltipContent>
      </Tooltip>

      <MediaCaptureShell
        isOpen={open === "camera"}
        onOpenChange={onOpenChange}
        title="Camera"
        description="Take a photo, or switch to video and record a clip."
      >
        <CameraCapture onCapture={capture} />
      </MediaCaptureShell>

      <MediaCaptureShell
        isOpen={open === "microphone"}
        onOpenChange={onOpenChange}
        title="Record audio"
        description="Nothing leaves your device until you send it."
      >
        <MicrophoneCapture onCapture={capture} />
      </MediaCaptureShell>
    </>
  );
};
