import type { IconSvgElement } from "@hugeicons/react";

// One choice in a sort menu: what it is called and the icon it is recognised by
export type SortOption<Value extends string> = {
  value: Value;
  label: string;
  icon: IconSvgElement;
};
