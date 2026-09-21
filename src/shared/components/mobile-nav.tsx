"use client";

import { Menu01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";

import { Button } from "@/shared/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/shared/components/ui/drawer";

type Props = {
  // What isn't a page, such as Settings and Leave, composed by the route. The pages themselves
  // are in the tab bar.
  actions: React.ReactNode;
};

export function MobileNav({ actions }: Props) {
  const [isOpen, setIsOpen] = useState(false);

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
          <DrawerDescription className="sr-only">
            Settings, and leaving Twittesia.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-2 px-4 pt-2 pb-10" onClick={() => setIsOpen(false)}>
          {actions}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
