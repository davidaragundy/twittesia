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
import { Spinner } from "@/shared/components/ui/spinner";

import { useLeaveDialog } from "@/features/settings/hooks/use-leave-dialog";

// None of it can be undone: there is no password, no email address and no way back to an
// identity once it is gone. So it asks.
export const LeaveDialog = () => {
  const { isOpen, isPending, onOpenChange, confirm } = useLeaveDialog();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Leave Twittesia?</DialogTitle>
          <DialogDescription>
            This ends who you are, right now. There is no password and no email address, so nothing
            can bring this identity back, and coming back later means starting again as someone new.
            What you have already written stays until it expires, within a day; delete anything you
            would rather take with you first.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={isPending}>
            Stay
          </Button>
          <Button variant="destructive" onClick={confirm} disabled={isPending}>
            {isPending && <Spinner data-icon="inline-start" />}
            Leave for good
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
