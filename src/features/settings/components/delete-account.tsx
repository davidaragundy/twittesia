"use client";

import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Spinner } from "@/shared/components/ui/spinner";

import { useDeleteAccount } from "@/features/settings/hooks/use-delete-account";

export const DeleteAccount = () => {
  const { isOpen, onOpenChange, isPending, confirm } = useDeleteAccount();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            className="self-start text-destructive hover:bg-destructive/10 hover:text-destructive dark:hover:bg-destructive/20"
          />
        }
      >
        Delete account
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete your account?</DialogTitle>
          <DialogDescription>
            This deletes your profile, your sign-in methods and every post you have written. Posts
            you published as a ghost carry no link to you, so they stay until they expire. This
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={isPending}>
            Keep my account
          </Button>
          <Button variant="destructive" onClick={confirm} disabled={isPending}>
            {isPending && <Spinner data-icon="inline-start" />}
            Email me the link
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
