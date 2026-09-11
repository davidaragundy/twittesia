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
  footer: React.ReactNode;
};

export function MobileNav({ links, footer }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen} swipeDirection="left">
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
        <div className="flex flex-1 flex-col gap-10 px-4 pb-8">
          <AppNav links={links} onNavigate={() => setIsOpen(false)} />
          <div className="mt-auto">{footer}</div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
