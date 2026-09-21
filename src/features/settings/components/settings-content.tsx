import { Suspense } from "react";

import { AccountDetails } from "@/features/settings/components/account-details";
import { AccountDetailsSkeleton } from "@/features/settings/components/account-details-skeleton";
import type { SettingsTab } from "@/features/settings/types/settings-tab";

interface Props {
  section: SettingsTab;
}

// What a section shows, the same in the dialog and on the page. Each section waits for the
// session behind a skeleton of its own fields.
export function SettingsContent({ section }: Props) {
  if (section === "account") {
    return (
      <Suspense fallback={<AccountDetailsSkeleton />}>
        <AccountDetails />
      </Suspense>
    );
  }

  return null;
}
