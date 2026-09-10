import { ActiveSessions } from "@/features/settings/components/active-sessions";
import { ChangePasswordForm } from "@/features/settings/components/change-password-form";
import { GenerateBackupCodesForm } from "@/features/settings/components/generate-backup-codes-form";
import { SettingsPageHeader } from "@/features/settings/components/settings-page-header";
import { ToggleTwoFactorForm } from "@/features/settings/components/toggle-two-factor-form";

export default function SettingsSecurityPage() {
  return (
    <>
      <SettingsPageHeader title="Security" description="Update your account's security settings." />

      <ChangePasswordForm />
      <ToggleTwoFactorForm />
      <GenerateBackupCodesForm />
      <ActiveSessions />
    </>
  );
}
