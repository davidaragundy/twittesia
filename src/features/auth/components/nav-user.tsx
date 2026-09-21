"use client";

import { Logout01Icon, UnfoldMoreIcon } from "@hugeicons/core-free-icons";

import { Icon } from "@/shared/components/icon";
import { NavButton } from "@/shared/components/nav-button";
import { SeededAvatar } from "@/shared/components/seeded-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

import { useNavUser } from "@/features/auth/hooks/use-nav-user";

type Props = {
  // Account menu entries owned by other features, composed by the route
  menuItems?: React.ReactNode;
};

export function NavUser({ menuItems }: Props) {
  const { user, openLeave } = useNavUser();

  if (!user) return null;

  const identity = (
    <>
      <SeededAvatar seed={user.username ?? user.id} size="sm" />
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-medium">{user.name}</span>
        <span className="truncate handle text-xs text-muted-foreground">
          @{user.displayUsername}
        </span>
      </div>
    </>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<NavButton className="h-auto min-h-12" />}>
        {identity}
        <Icon icon={UnfoldMoreIcon} />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="start" sideOffset={8} className="min-w-56">
        <DropdownMenuGroup>
          <div className="flex items-center gap-2 px-1 py-1.5">{identity}</div>
        </DropdownMenuGroup>
        <DropdownMenuGroup>{menuItems}</DropdownMenuGroup>
        {/* Opens the confirmation; the menu closes behind it */}
        <DropdownMenuItem variant="destructive" onClick={openLeave}>
          <Icon icon={Logout01Icon} />
          Leave
          <DropdownMenuShortcut>⌘O</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
