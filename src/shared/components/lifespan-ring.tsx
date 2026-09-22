"use client";

import { cn } from "cn";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/tooltip";
import { useLifespan } from "@/shared/hooks/use-lifespan";

type Props = {
  startsAt: Date;
  endsAt: Date;
  // The ring's width in pixels; the stroke keeps its weight at any size
  size?: number;
  children?: React.ReactNode;
};

const STROKE = 1.5;

// A small clock that empties as something's life runs out, with exactly how long is left on hover.
// The server and the browser read their own clocks, so the first paint can differ by a moment.
export function LifespanRing({ startsAt, endsAt, size = 14, children }: Props) {
  const { remaining, timeLeft, isEnding } = useLifespan({ startsAt, endsAt });
  const outer = (size - STROKE) / 2;
  // The wedge stops short of the outline, so a sliver of space keeps the two apart
  const wedge = outer - STROKE;
  const circumference = Math.PI * wedge;
  const label = timeLeft ? `Gone in ${timeLeft}` : "Gone";

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
        {/* A clock face: the outline is the whole day, the wedge inside is what is left of it */}
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          aria-hidden
          className="-rotate-90"
          suppressHydrationWarning
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={outer}
            fill="none"
            strokeWidth={STROKE}
            className={isEnding ? "stroke-warning" : "stroke-muted-foreground"}
          />
          {/* A circle stroked as wide as its own diameter draws a wedge out of its dash */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={wedge / 2}
            fill="none"
            strokeWidth={wedge}
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - remaining)}
            className={cn(
              "transition-all duration-700",
              isEnding ? "stroke-warning" : "stroke-muted-foreground",
            )}
            suppressHydrationWarning
          />
        </svg>
        {children && (
          <span className="absolute inset-0 flex items-center justify-center">{children}</span>
        )}
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
