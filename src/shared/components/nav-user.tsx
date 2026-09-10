"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Loading03Icon,
  Logout01Icon,
  Moon01Icon,
  MoreHorizontalIcon,
  Sun01Icon,
} from "@hugeicons/core-free-icons";

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/shared/components/ui/drawer";
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
import { useNavUser } from "@/shared/hooks/use-nav-user";

import type { Session } from "@/features/auth/types";

interface Props {
  user: Session["user"];
}

export const NavUser = ({ user }: Props) => {
  const { handleSignOut, handleThemeChange, isMobile, isSigningOut, theme } = useNavUser();

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger>
          <div className="relative">
            <Avatar className="size-10">
              <AvatarImage src={user.image || undefined} alt={user.name} />

              <AvatarFallback>
                {user.name
                  ?.split(" ")
                  .map((name) => name[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <span className="border-background absolute -inset-e-0.5 -bottom-0.5 size-3 rounded-full border-2 bg-emerald-500">
              <span className="sr-only">Online</span>
            </span>
          </div>
        </DrawerTrigger>

        <DrawerContent className="pb-4">
          <DrawerHeader>
            <DrawerTitle>My account</DrawerTitle>

            <DrawerDescription className="sr-only">
              Your account settings and preferences.
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex flex-col gap-2 px-4">
            <Button
              title="Toggle theme"
              aria-label="Toggle theme"
              variant="ghost"
              className="w-full p-0! justify-start"
              onClick={() => handleThemeChange()}
            >
              {theme === "dark" ? (
                <HugeiconsIcon icon={Moon01Icon} />
              ) : (
                <HugeiconsIcon icon={Sun01Icon} />
              )}
              Toggle theme
            </Button>

            <Button
              variant="ghost"
              className="w-full p-0! text-destructive justify-start"
              onClick={() => handleSignOut()}
            >
              {isSigningOut ? (
                <HugeiconsIcon icon={Loading03Icon} className="animate-spin" />
              ) : (
                <HugeiconsIcon icon={Logout01Icon} />
              )}
              Sign out
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <div className="w-full flex items-center gap-4">
      <div className="relative">
        <Avatar className="size-10">
          <AvatarImage src={user.image || undefined} alt={user.name} />
          <AvatarFallback>
            {user.name
              ?.split(" ")
              .map((name) => name[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <span className="border-background absolute -inset-e-0.5 -bottom-0.5 size-3 rounded-full border-2 bg-emerald-500">
          <span className="sr-only">Online</span>
        </span>
      </div>

      <div className="hidden sm:flex flex-col overflow-hidden">
        <span className="text-sm font-semibold text-ellipsis">{user.name}</span>
        <span className="text-xs text-muted-foreground text-ellipsis">@{user.displayUsername}</span>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger className="rounded-full hidden sm:flex size-9 items-center justify-center hover:bg-muted">
          <HugeiconsIcon icon={MoreHorizontalIcon} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => handleThemeChange()}>
            {theme === "dark" ? (
              <HugeiconsIcon icon={Moon01Icon} />
            ) : (
              <HugeiconsIcon icon={Sun01Icon} />
            )}
            Toggle theme
            <DropdownMenuShortcut>⌘⇧T</DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuItem variant="destructive" onClick={() => handleSignOut()}>
            {isSigningOut ? (
              <HugeiconsIcon icon={Loading03Icon} className="animate-spin" />
            ) : (
              <HugeiconsIcon icon={Logout01Icon} />
            )}
            Sign out
            <DropdownMenuShortcut>⌘O</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
