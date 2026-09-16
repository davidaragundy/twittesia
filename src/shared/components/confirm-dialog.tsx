"use client";

import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/shared/components/ui/drawer";
import { Spinner } from "@/shared/components/ui/spinner";
import { useIsMobile } from "@/shared/hooks/use-mobile";

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  isPending: boolean;
};

// A destructive confirmation: a dialog on larger screens and a drawer on phones
export const ConfirmDialog = ({
  isOpen,
  onOpenChange,
  title,
  description,
  confirmLabel,
  onConfirm,
  isPending,
}: Props) => {
  const isMobile = useIsMobile();

  const actions = (
    <>
      <Button variant="ghost" size="lg" onClick={() => onOpenChange(false)} disabled={isPending}>
        Cancel
      </Button>
      <Button variant="destructive" size="lg" onClick={onConfirm} disabled={isPending}>
        {isPending && <Spinner data-icon="inline-start" />}
        {confirmLabel}
      </Button>
    </>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader className="gap-2 px-6 pt-6">
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter className="flex-col-reverse gap-2 px-6 pt-6 pb-8">{actions}</DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="gap-8 p-8 sm:max-w-md" showCloseButton={false}>
        <DialogHeader className="gap-2">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">{actions}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
