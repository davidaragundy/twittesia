import { AccountDetails } from "@/features/settings/components/account-details";
import type { SettingsTab } from "@/features/settings/types/settings-tab";

interface Props {
  section: SettingsTab;
}

// What a section shows, the same in the dialog and on the page
export function SettingsContent({ section }: Props) {
  if (section === "account") return <AccountDetails />;

  return null;
}
