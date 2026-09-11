import { SecurityLockIcon, UserIcon } from "@hugeicons/core-free-icons";

// The tabs of the settings dialog, in order; the first one opens by default
export const SETTINGS_SECTIONS = [
  { value: "account", label: "Account", icon: UserIcon },
  { value: "security", label: "Security", icon: SecurityLockIcon },
] as const;
