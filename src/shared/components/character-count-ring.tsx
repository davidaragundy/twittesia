"use client";

import { cn } from "cn";

import { CHARACTER_COUNT_RING_GEOMETRY } from "@/shared/constants/character-count-ring-geometry";
import { useCharacterCountRing } from "@/shared/hooks/use-character-count-ring";

type Props = {
  length: number;
  max: number;
};

export const CharacterCountRing = ({ length, max }: Props) => {
  const { remaining, tone, circumference, dashOffset, showCount, label } = useCharacterCountRing({
    length,
    max,
  });
  const { size, radius, strokeWidth } = CHARACTER_COUNT_RING_GEOMETRY;

  return (
    <div className="flex items-center gap-2">
      {showCount && (
        <span
          aria-live="polite"
          className={cn(
            "text-xs font-medium tabular-nums",
            tone === "warning" ? "text-amber-600 dark:text-amber-400" : "text-destructive",
          )}
        >
          {remaining}
        </span>
      )}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={label}
        className="-rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-muted-foreground/20"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className={cn(
            "transition-[stroke-dashoffset,stroke] duration-200",
            tone === "normal" && "stroke-foreground",
            tone === "warning" && "stroke-amber-500",
            tone === "over" && "stroke-destructive",
          )}
        />
      </svg>
    </div>
  );
};
