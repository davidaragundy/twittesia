import type { SETTINGS_SECTIONS } from "@/features/settings/constants/settings-sections";

export type SettingsTab = (typeof SETTINGS_SECTIONS)[number]["value"];
