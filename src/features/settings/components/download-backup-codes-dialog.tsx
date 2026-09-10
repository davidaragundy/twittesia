"use client";

import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  const { handleDownloadBackupCodes } = useDownloadBackupCodesDialog({
    backupCodes,
    closeDialog,
  });

  return (
    <Dialog open={isOpen}>
      <DialogContent showCloseButton={false} className="flex flex-col gap-8">
        <DialogHeader>
          <DialogTitle>Download backup codes</DialogTitle>
          <DialogDescription>
            Please download your backup codes and keep them in a safe place.
          </DialogDescription>
        </DialogHeader>

        <Button onClick={handleDownloadBackupCodes} className="mx-auto">
          Download backup codes
        </Button>
      </DialogContent>
    </Dialog>
  );
};
