import { ComputerIcon, Moon01Icon, Sun01Icon } from "@hugeicons/core-free-icons";

// The looks Twittesia can take; System follows whatever the device is set to
export const THEME_OPTIONS = [
  { value: "light", label: "Light", icon: Sun01Icon },
  { value: "dark", label: "Dark", icon: Moon01Icon },
  { value: "system", label: "System", icon: ComputerIcon },
] as const;
