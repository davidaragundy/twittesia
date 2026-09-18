import { RECORDING_RULES } from "@/features/media/constants/recording-rules";
import type { RecordingKind } from "@/features/media/types/recording-kind";

interface Props {
  kind: RecordingKind;
}

// The first type this browser can record, or none, in which case it picks its own
export const pickRecordingMimeType = ({ kind }: Props) =>
  RECORDING_RULES[kind].mimeTypes.find((type) => MediaRecorder.isTypeSupported(type));
