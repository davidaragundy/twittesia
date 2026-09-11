import { SETTINGS_SECTIONS } from "@/features/settings/constants/settings-sections";
import type { SettingsTab } from "@/features/settings/types/settings-tab";

export const isSettingsTab = (value: unknown): value is SettingsTab =>
  SETTINGS_SECTIONS.some((section) => section.value === value);
