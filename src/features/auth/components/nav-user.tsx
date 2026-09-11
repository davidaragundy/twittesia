"use client";

import { Logout01Icon, UnfoldMoreIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { NavButton } from "@/shared/components/nav-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Spinner } from "@/shared/components/ui/spinner";
import { getInitials } from "@/shared/utils/get-initials";

import { useNavUser } from "@/features/auth/hooks/use-nav-user";

type Props = {
  // Account menu entries owned by other features, composed by the route
  menuItems?: React.ReactNode;
};

export function NavUser({ menuItems }: Props) {
  const { user, signOut, isSigningOut } = useNavUser();

  if (!user) return null;

  const identity = (
    <>
      <Avatar size="sm">
        <AvatarImage src={user.image ?? undefined} alt={user.name} />
        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-medium">{user.name}</span>
        <span className="truncate text-xs text-muted-foreground">@{user.displayUsername}</span>
      </div>
    </>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<NavButton className="h-auto py-3" />}>
        {identity}
        <HugeiconsIcon icon={UnfoldMoreIcon} />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="start" sideOffset={8} className="min-w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5">{identity}</div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>{menuItems}</DropdownMenuGroup>
        <DropdownMenuSeparator />
        {/* Stays open so the spinner shows until the sign-out lands */}
        <DropdownMenuItem
          variant="destructive"
          closeOnClick={false}
          disabled={isSigningOut}
          onClick={signOut}
        >
          {isSigningOut ? <Spinner /> : <HugeiconsIcon icon={Logout01Icon} />}
          Sign out
          <DropdownMenuShortcut>⌘O</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
