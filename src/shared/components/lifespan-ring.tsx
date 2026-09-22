"use client";

import { cn } from "cn";

import { ClockFace } from "@/shared/components/clock-face";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/tooltip";
import { useLifespan } from "@/shared/hooks/use-lifespan";

type Props = {
  startsAt: Date;
  endsAt: Date;
  // The ring's width in pixels; the stroke keeps its weight at any size
  size?: number;
  // What else the tooltip says above how long is left, such as when it began
  details?: string;
  children?: React.ReactNode;
};

// A small clock that empties as something's life runs out, with exactly how long is left on hover.
// The server and the browser read their own clocks, so the first paint can differ by a moment.
export function LifespanRing({ startsAt, endsAt, size = 14, details, children }: Props) {
  const { remaining, timeLeft, isEnding } = useLifespan({ startsAt, endsAt });
  const left = timeLeft ? `Gone in ${timeLeft}` : "Gone";
  const label = details ? `${details}. ${left}` : left;

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <span
            role="img"
            aria-label={label}
            className="relative inline-flex shrink-0 items-center justify-center"
          />
        }
      >
        <ClockFace remaining={remaining} size={size} isEnding={isEnding} />
        {children && (
          <span className="absolute inset-0 flex items-center justify-center">{children}</span>
        )}
      </TooltipTrigger>
      <TooltipContent>
        <span className="flex flex-col gap-0.5">
          {details && <span>{details}</span>}
          <span className={cn(details && "opacity-70")}>{left}</span>
        </span>
      </TooltipContent>
    </Tooltip>
  );
}
