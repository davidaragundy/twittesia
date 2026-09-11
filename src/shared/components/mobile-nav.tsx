"use client";

import { Menu01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";

import { AppNav } from "@/shared/components/app-nav";
import { Button } from "@/shared/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/shared/components/ui/drawer";
import type { NavLink } from "@/shared/types";

type Props = {
  links: NavLink[];
  // Extra menu entries, such as Settings and Sign out, composed by the route
  actions: React.ReactNode;
};

export function MobileNav({ links, actions }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger
        render={<Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu" />}
      >
        <HugeiconsIcon icon={Menu01Icon} />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Menu</DrawerTitle>
          <DrawerDescription className="sr-only">Go to a page of Twittesia.</DrawerDescription>
        </DrawerHeader>
        <div className="overflow-y-auto px-4 pt-2 pb-10">
          <AppNav links={links} onNavigate={close}>
            <div className="contents" onClick={close}>
              {actions}
            </div>
          </AppNav>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
