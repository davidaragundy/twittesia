import { Button } from "@/shared/components/ui/button";

type Props = {
  isActive?: boolean;
  label: string;
  icon: React.ReactNode;
} & Omit<React.ComponentProps<typeof Button>, "children">;

// One tab of the phone's tab bar: an icon, and the page's name beside it on the page you're on
export function TabBarButton({ isActive = false, label, icon, ...props }: Props) {
  return (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      size={isActive ? "lg" : "icon-lg"}
      aria-label={isActive ? undefined : label}
      aria-current={isActive ? "page" : undefined}
      {...props}
    >
      {icon}
      {isActive && label}
    </Button>
  );
}
