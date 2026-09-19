import type { SettingsTab } from "@/features/settings/types/settings-tab";

interface Props {
  section: SettingsTab;
}

// Where a section of the settings lives: a page of its own, or the dialog over the current page
// when it is opened from inside the app
export const toSettingsPath = ({ section }: Props) => `/settings/${section}`;
