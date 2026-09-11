import { BACKUP_CODES_FILE_NAME } from "@/features/settings/constants/backup-codes-file-name";

// Saves the codes as a text file, one per line
export const downloadBackupCodes = (backupCodes: string[]) => {
  const url = URL.createObjectURL(new Blob([backupCodes.join("\n")], { type: "text/plain" }));

  const link = document.createElement("a");
  link.href = url;
  link.download = BACKUP_CODES_FILE_NAME;
  link.click();

  URL.revokeObjectURL(url);
};
