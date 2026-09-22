import { cn } from "cn";

type Props = {
  // How much is left, from 1 (all of it) to 0
  remaining: number;
  size: number;
  // Drawn in the warning colour, for the last stretch
  isEnding?: boolean;
  // Drawn at full contrast, for a clock that is the subject rather than a detail
  isEmphasized?: boolean;
  className?: string;
};

// A clock face: the outline is the whole span, the wedge inside is what is left of it
export function ClockFace({
  remaining,
  size,
  isEnding = false,
  isEmphasized = false,
  className,
}: Props) {
  // The outline keeps its weight at small sizes and grows a little at large ones
  const stroke = Math.max(1.5, size / 40);
  const outer = (size - stroke) / 2;
  // The wedge stops short of the outline, so a sliver of space keeps the two apart
  const wedge = outer - stroke * 1.5;
  const circumference = Math.PI * wedge;
  const tone = isEnding
    ? "stroke-warning"
    : isEmphasized
      ? "stroke-foreground"
      : "stroke-muted-foreground";

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden
      className={cn("-rotate-90", className)}
      suppressHydrationWarning
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={outer}
        fill="none"
        strokeWidth={stroke}
        className={tone}
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
        className={cn("transition-all duration-700", tone)}
        suppressHydrationWarning
      />
    </svg>
  );
}
