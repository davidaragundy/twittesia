import { Suspense } from "react";

import { SessionProvider } from "@/features/auth/components/session-provider";
import { SettingsDialog } from "@/features/settings/components/settings-dialog";
import { SETTINGS_SECTIONS } from "@/features/settings/constants/settings-sections";

export const generateStaticParams = () =>
  SETTINGS_SECTIONS.map((section) => ({ section: section.value }));

// /settings/<section> opened from inside the app: the dialog, over the page it was opened from
export default function Page({ params }: PageProps<"/settings/[section]">) {
  return (
    <Suspense>
      <SessionProvider>
        <SettingsDialog params={params} />
      </SessionProvider>
    </Suspense>
  );
}
