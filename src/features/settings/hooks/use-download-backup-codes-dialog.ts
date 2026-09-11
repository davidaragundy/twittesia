import { downloadBackupCodes } from "@/features/settings/utils/download-backup-codes";

interface Props {
  backupCodes: string[];
  closeDialog: () => void;
}

export const useDownloadBackupCodesDialog = ({ backupCodes, closeDialog }: Props) => {
  const handleDownloadBackupCodes = () => {
    downloadBackupCodes(backupCodes);
    closeDialog();
  };

  return { handleDownloadBackupCodes };
};
