import { HugeiconsIcon, type HugeiconsIconProps } from "@hugeicons/react";

// Every icon in the app at one weight, the stroke the registry's components draw theirs with
export function Icon({ strokeWidth = 2, ...props }: HugeiconsIconProps) {
  return <HugeiconsIcon strokeWidth={strokeWidth} {...props} />;
}
