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

import { useDownloadBackupCodesDialog } from "@/features/settings/hooks/use-download-backup-codes-dialog";

interface Props {
  isOpen: boolean;
  closeDialog: () => void;
  backupCodes: string[];
}

export const DownloadBackupCodesDialog = ({ isOpen, closeDialog, backupCodes }: Props) => {
  const { handleDownloadBackupCodes } = useDownloadBackupCodesDialog({ backupCodes, closeDialog });

  return (
    <Dialog open={isOpen}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Download backup codes</DialogTitle>
          <DialogDescription>
            Each code signs you in once if you lose your authenticator app. Keep them somewhere
            safe.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleDownloadBackupCodes}>Download backup codes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
