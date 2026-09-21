import { type IconSvgElement } from "@hugeicons/react";

import { Icon } from "@/shared/components/icon";

import { CAPTURE_ERROR_COPY } from "@/features/media/constants/capture-error-copy";
import type { CaptureError } from "@/features/media/types/capture-error";

interface Props {
  error: CaptureError;
  // "camera" or "microphone", as the copy names it
  device: string;
  icon: IconSvgElement;
}

export const CaptureErrorMessage = ({ error, device, icon }: Props) => (
  <div className="flex max-w-xs flex-col items-center gap-3 p-6 text-center">
    <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
      <Icon icon={icon} className="size-5" />
    </span>
    <p className="font-medium">{CAPTURE_ERROR_COPY[error].title}</p>
    <p className="text-sm text-muted-foreground">{CAPTURE_ERROR_COPY[error].description(device)}</p>
  </div>
);
