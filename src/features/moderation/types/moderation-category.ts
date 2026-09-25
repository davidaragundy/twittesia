import type { MODERATION_CATEGORIES } from "@/features/moderation/constants/moderation-categories";

export type ModerationCategory = (typeof MODERATION_CATEGORIES)[number]["value"];
