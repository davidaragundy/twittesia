import type { ModerationCategory } from "@/features/moderation/types/moderation-category";

// How likely a text is to fall in each category, as Jev judged it when it was written. Kept raw,
// so what gets hidden is decided by thresholds and each reader's preferences, never by asking the
// model again.
export type ModerationFlags = Partial<Record<ModerationCategory, number>>;
