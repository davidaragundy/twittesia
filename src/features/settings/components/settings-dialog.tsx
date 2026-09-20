"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Suspense } from "react";

import { NavButton } from "@/shared/components/nav-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/shared/components/ui/drawer";
import { Spinner } from "@/shared/components/ui/spinner";
import { ToggleGroup, ToggleGroupItem } from "@/shared/components/ui/toggle-group";

import { SettingsContent } from "@/features/settings/components/settings-content";
import { SETTINGS_DIALOG_DESCRIPTION } from "@/features/settings/constants/settings-dialog-description";
import { SETTINGS_DIALOG_TITLE } from "@/features/settings/constants/settings-dialog-title";
import { SETTINGS_SECTIONS } from "@/features/settings/constants/settings-sections";
import { useSettingsDialog } from "@/features/settings/hooks/use-settings-dialog";

interface Props {
  params: Promise<{ section: string }>;
}

export function SettingsDialog({ params }: Props) {
  const { section, isMobile, isOpen, onOpenChange, onOpenChangeComplete, onTabChange } =
    useSettingsDialog({ params });

  // A section that doesn't exist opens nothing; loaded directly, the page answers with a 404
  if (!section) return null;

  // The same buttons as the app navigation, so active and hover look identical
  const navigation = (
    <nav aria-label="Settings sections" className="flex flex-col gap-2">
      {SETTINGS_SECTIONS.map((item) => (
        <NavButton
          key={item.value}
          isActive={section === item.value}
          onClick={() => onTabChange(item.value)}
        >
          <HugeiconsIcon icon={item.icon} />
          {item.label}
        </NavButton>
      ))}
    </nav>
  );

  const content = <SettingsContent section={section} />;

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onOpenChange} onOpenChangeComplete={onOpenChangeComplete}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{SETTINGS_DIALOG_TITLE}</DrawerTitle>
            <DrawerDescription>{SETTINGS_DIALOG_DESCRIPTION}</DrawerDescription>
          </DrawerHeader>
          <div className="flex min-h-0 flex-col gap-10 overflow-y-auto px-4 pt-4 pb-12">
            <ToggleGroup
              aria-label="Settings sections"
              value={[section]}
              onValueChange={(value) => onTabChange(value[0])}
              className="self-center"
            >
              {SETTINGS_SECTIONS.map((item) => (
                <ToggleGroupItem key={item.value} value={item.value}>
                  <HugeiconsIcon icon={item.icon} />
                  {item.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            <Suspense fallback={<Spinner className="self-center" />}>{content}</Suspense>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange} onOpenChangeComplete={onOpenChangeComplete}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{SETTINGS_DIALOG_TITLE}</DialogTitle>
          <DialogDescription>{SETTINGS_DIALOG_DESCRIPTION}</DialogDescription>
        </DialogHeader>
        <div className="flex gap-20">
          <div className="w-44 shrink-0">{navigation}</div>
          <div className="-mr-10 no-scrollbar max-h-[70vh] min-w-0 flex-1 overflow-y-auto pr-10">
            <Suspense fallback={<Spinner />}>{content}</Suspense>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
