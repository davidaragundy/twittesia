"use client";

import { cn } from "@/shared/utils/cn";

import { POST_LENGTH_RING_GEOMETRY } from "@/features/posts/constants/post-length-ring-geometry";
import { usePostLengthRing } from "@/features/posts/hooks/use-post-length-ring";

interface Props {
  length: number;
}

export const PostLengthRing = ({ length }: Props) => {
  const { remaining, tone, circumference, dashOffset, showCount, label } = usePostLengthRing({
    length,
  });
  const { size, radius, strokeWidth } = POST_LENGTH_RING_GEOMETRY;

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
