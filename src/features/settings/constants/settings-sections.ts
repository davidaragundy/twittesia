import { PaintBoardIcon, UserIcon } from "@hugeicons/core-free-icons";

// The tabs of the settings dialog, in order; the first one opens by default
export const SETTINGS_SECTIONS = [
  { value: "account", label: "Account", icon: UserIcon },
  { value: "appearance", label: "Appearance", icon: PaintBoardIcon },
] as const;
