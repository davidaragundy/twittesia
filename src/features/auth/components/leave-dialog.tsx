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

import { useLeaveDialog } from "@/features/auth/hooks/use-leave-dialog";

// Leaving is the most destructive thing anyone can do here and none of it can be undone: there
// is no password, no email address and no way back to an identity once it is gone. So it asks.
export const LeaveDialog = () => {
  const { isOpen, isPending, onOpenChange, confirm } = useLeaveDialog();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Leave Twittesia?</DialogTitle>
          <DialogDescription>
            This deletes who you are and everything you wrote, right now. There is no password and
            no email address, so nothing can bring any of it back. Coming back later means starting
            again as someone new.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={isPending}>
            Stay
          </Button>
          <Button variant="destructive" onClick={confirm} disabled={isPending}>
            {isPending && <Spinner data-icon="inline-start" />}
            Leave and delete everything
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
