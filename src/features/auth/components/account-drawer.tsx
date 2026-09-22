"use client";

import { usePathname } from "next/navigation";

import { SeededAvatar } from "@/shared/components/seeded-avatar";
import { TabBarButton } from "@/shared/components/tab-bar-button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/shared/components/ui/drawer";

import { IdentityExpiryBadge } from "@/features/auth/components/identity-expiry-badge";
import { useAccountDrawer } from "@/features/auth/hooks/use-account-drawer";

type Props = {
  // What the account offers, owned by other features and composed by the route: the profile,
  // settings, leaving
  actions: React.ReactNode;
};

// The last tab on a phone: your face, and everything about your identity behind it
export function AccountDrawer({ actions }: Props) {
  const pathname = usePathname();
  const { user, isOpen, setOpen, close } = useAccountDrawer();

  if (!user) return null;

  return (
    <Drawer open={isOpen} onOpenChange={setOpen}>
      <DrawerTrigger
        render={
          <TabBarButton
            label="Profile"
            isActive={pathname === `/${user.username}`}
            icon={<SeededAvatar seed={user.username} size="sm" />}
          />
        }
      />
      <DrawerContent>
        <DrawerHeader className="items-center">
          <SeededAvatar seed={user.username} size="lg" className="mt-2 mb-2 size-16" />
          <DrawerTitle>{user.name}</DrawerTitle>
          <DrawerDescription>
            <span className="handle">@{user.displayUsername}</span>
          </DrawerDescription>
          <div className="mt-2 flex justify-center">
            <IdentityExpiryBadge expiresAt={new Date(user.expiresAt)} />
          </div>
        </DrawerHeader>
        {/* Anything chosen here leaves the drawer behind */}
        <nav aria-label="Profile" className="flex flex-col gap-1 px-4 pt-4 pb-10" onClick={close}>
          {actions}
        </nav>
      </DrawerContent>
    </Drawer>
  );
}
