import { ViewIcon } from "@hugeicons/core-free-icons";

import { Icon } from "@/shared/components/icon";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/tooltip";

type Props = {
  // As shown, such as "1.2K"
  count: string;
  // Spelled out, such as "1,204 views", for the tooltip and screen readers
  label: string;
};

// How many have read something: quiet, and the height of the buttons beside it so a row lines up
export function ViewCount({ count, label }: Props) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <span
            role="img"
            aria-label={label}
            className="inline-flex h-8 shrink-0 items-center gap-1.5 px-2 text-sm text-muted-foreground tabular-nums"
          />
        }
      >
        <Icon icon={ViewIcon} className="size-4" />
        {count}
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
