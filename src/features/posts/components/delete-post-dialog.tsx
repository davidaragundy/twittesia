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

import { DELETE_POST_DIALOG_COPY } from "@/features/posts/constants/delete-post-dialog-copy";

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export const DeletePostDialog = ({ isOpen, onOpenChange, onConfirm, isDeleting }: Props) => {
  const isMobile = useIsMobile();

  const actions = (
    <>
      <Button variant="ghost" size="lg" onClick={() => onOpenChange(false)} disabled={isDeleting}>
        Cancel
      </Button>
      <Button variant="destructive" size="lg" onClick={onConfirm} disabled={isDeleting}>
        {isDeleting && <Spinner data-icon="inline-start" />}
        Delete
      </Button>
    </>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader className="gap-2 px-6 pt-6">
            <DrawerTitle>{DELETE_POST_DIALOG_COPY.title}</DrawerTitle>
            <DrawerDescription>{DELETE_POST_DIALOG_COPY.description}</DrawerDescription>
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
          <DialogTitle>{DELETE_POST_DIALOG_COPY.title}</DialogTitle>
          <DialogDescription>{DELETE_POST_DIALOG_COPY.description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">{actions}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
