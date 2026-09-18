import type { CaptureError } from "@/features/media/types/capture-error";

interface Props {
  error: unknown;
}

export const toCaptureError = ({ error }: Props): CaptureError => {
  const name = error instanceof DOMException ? error.name : "";

  if (name === "NotAllowedError" || name === "SecurityError") return "blocked";
  if (name === "NotFoundError" || name === "OverconstrainedError") return "missing";

  return "failed";
};
