"use client";

import {
  ArrowReloadHorizontalIcon,
  Logout01Icon,
  Moon01Icon,
  Settings01Icon,
  Sun01Icon,
  UnfoldMoreIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

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
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  useSidebar,
} from "@/shared/components/ui/sidebar";
import { Spinner } from "@/shared/components/ui/spinner";

import { useNavUser } from "@/features/auth/hooks/use-nav-user";
import { useSession } from "@/features/auth/hooks/use-session";

export function NavUser() {
  const { isMobile } = useSidebar();
  const { handleSignOut, handleThemeChange, isSigningOut, theme } = useNavUser();
  const { data: session, isLoading, isError, isRefetching, refetch } = useSession();

  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuSkeleton showIcon />
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (isError || !session) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton onClick={() => refetch()} disabled={isRefetching}>
            {isRefetching ? <Spinner /> : <HugeiconsIcon icon={ArrowReloadHorizontalIcon} />}
            <span>Retry</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  const { user } = session;
  const avatar = (
    <Avatar>
      <AvatarImage src={user.image ?? undefined} alt={user.name} />
      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
    </Avatar>
  );
  const identity = (
    <div className="grid flex-1 text-left text-sm leading-tight">
      <span className="truncate font-medium">{user.name}</span>
      <span className="truncate text-xs">@{user.displayUsername}</span>
    </div>
  );

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<SidebarMenuButton size="lg" className="aria-expanded:bg-muted" />}
          >
            {avatar}
            {identity}
            <HugeiconsIcon icon={UnfoldMoreIcon} className="ml-auto size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-fit"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  {avatar}
                  {identity}
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem render={<Link href="?settings=account" scroll={false} />}>
                <HugeiconsIcon icon={Settings01Icon} />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleThemeChange()}>
                <HugeiconsIcon icon={theme === "dark" ? Moon01Icon : Sun01Icon} />
                Toggle theme
                <DropdownMenuShortcut>⌘⇧T</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={() => handleSignOut()}>
              {isSigningOut ? <Spinner /> : <HugeiconsIcon icon={Logout01Icon} />}
              Sign out
              <DropdownMenuShortcut>⌘O</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("");
}
