"use client";

import {
  ArrowReloadHorizontalIcon,
  Logout01Icon,
  UnfoldMoreIcon,
} from "@hugeicons/core-free-icons";
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
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Spinner } from "@/shared/components/ui/spinner";

import { useNavUser } from "@/features/auth/hooks/use-nav-user";
import { useSession } from "@/features/auth/hooks/use-session";

type Props = {
  // Account menu entries owned by other features, composed by the route
  menuItems?: React.ReactNode;
};

export function NavUser({ menuItems }: Props) {
  const { handleSignOut, isSigningOut } = useNavUser();
  const { data: session, isLoading, isError, isRefetching, refetch } = useSession();

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 px-4">
        <Skeleton className="size-8 rounded-full" />
        <div className="flex flex-1 flex-col gap-1.5">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    );
  }

  if (isError || !session) {
    return (
      <NavButton onClick={() => refetch()} disabled={isRefetching}>
        {isRefetching ? <Spinner /> : <HugeiconsIcon icon={ArrowReloadHorizontalIcon} />}
        Retry
      </NavButton>
    );
  }

  const { user } = session;
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
      <DropdownMenuTrigger render={<NavButton />}>
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
        <DropdownMenuItem variant="destructive" onClick={() => handleSignOut()}>
          {isSigningOut ? <Spinner /> : <HugeiconsIcon icon={Logout01Icon} />}
          Sign out
          <DropdownMenuShortcut>⌘O</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("");
}
