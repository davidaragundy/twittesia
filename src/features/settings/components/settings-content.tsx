import { Suspense } from "react";

import { ModerationSettings } from "@/features/moderation/components/moderation-settings";
import { AccountDetails } from "@/features/settings/components/account-details";
import { AccountDetailsSkeleton } from "@/features/settings/components/account-details-skeleton";
import { AppearanceSettings } from "@/features/settings/components/appearance-settings";
import type { SettingsTab } from "@/features/settings/types/settings-tab";

interface Props {
  section: SettingsTab;
}

// What a section shows, the same in the dialog and on the page. The account waits for the
// session behind a skeleton of its own fields; appearance and content need nothing but the browser.
export function SettingsContent({ section }: Props) {
  if (section === "account") {
    return (
      <Suspense fallback={<AccountDetailsSkeleton />}>
        <AccountDetails />
      </Suspense>
    );
  }

  if (section === "content") return <ModerationSettings />;

  return <AppearanceSettings />;
}
