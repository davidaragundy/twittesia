"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/tooltip";
import { useRelativeTime } from "@/shared/hooks/use-relative-time";

type Props = {
  date: Date;
};

// "3h ago", kept current as the minutes pass, with the exact moment on hover. The server and the
// browser read their own clocks, so the first paint can differ by a moment.
export function RelativeTime({ date }: Props) {
  const { relative, absolute } = useRelativeTime({ date });

  return (
    <Tooltip>
      <TooltipTrigger render={<time dateTime={date.toISOString()} suppressHydrationWarning />}>
        {relative}
      </TooltipTrigger>
      <TooltipContent>{absolute}</TooltipContent>
    </Tooltip>
  );
}
