import { Button } from "@/shared/components/ui/button";

type Props = {
  isActive?: boolean;
} & React.ComponentProps<typeof Button>;

// One look for every navigation item: a background on hover, the same background when active
export function NavButton({ isActive = false, ...props }: Props) {
  return (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      size="lg"
      className="w-full justify-start"
      aria-current={isActive ? "page" : undefined}
      {...props}
    />
  );
}
