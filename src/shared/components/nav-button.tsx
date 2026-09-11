import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/utils/cn";

type Props = {
  isActive?: boolean;
} & React.ComponentProps<typeof Button>;

// One look for every navigation item: a background on hover, the same background when active
export function NavButton({ isActive = false, className, ...props }: Props) {
  return (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      size="lg"
      className={cn(
        "h-12 w-full justify-start gap-3 px-4 text-base [&_svg:not([class*='size-'])]:size-5",
        className,
      )}
      aria-current={isActive ? "page" : undefined}
      {...props}
    />
  );
}
