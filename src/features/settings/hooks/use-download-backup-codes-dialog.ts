import { getTxtArrayBuffer } from "@/features/settings/utils/get-txt-array-buffer";

interface Props {
  backupCodes: string[];
  closeDialog: () => void;
}

export const useDownloadBackupCodesDialog = ({ backupCodes, closeDialog }: Props) => {
  const handleDownloadBackupCodes = () => {
    const buffer = getTxtArrayBuffer(backupCodes);

    const blob = new Blob([buffer], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "twittesia-backup-codes.txt";
    a.click();

    URL.revokeObjectURL(url);
    closeDialog();
  };

  return {
    handleDownloadBackupCodes,
  };
};
