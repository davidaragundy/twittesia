import { useState } from "react";

interface Props {
  onCapture: (files: File[]) => void;
}

// Which capture window is open, if either; using a capture closes it
export const useMediaCaptureButtons = ({ onCapture }: Props) => {
  const [open, setOpen] = useState<"camera" | "microphone" | null>(null);

  return {
    open,
    openCamera: () => setOpen("camera"),
    openMicrophone: () => setOpen("microphone"),
    onOpenChange: (isOpen: boolean) => {
      if (!isOpen) setOpen(null);
    },
    capture: (file: File) => {
      onCapture([file]);
      setOpen(null);
    },
  };
};
