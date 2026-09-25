import { PaintBoardIcon, UserIcon, ViewOffIcon } from "@hugeicons/core-free-icons";

// The tabs of the settings dialog, in order; the first one opens by default
export const SETTINGS_SECTIONS = [
  { value: "account", label: "Account", icon: UserIcon },
  { value: "appearance", label: "Appearance", icon: PaintBoardIcon },
  { value: "content", label: "Content", icon: ViewOffIcon },
] as const;
