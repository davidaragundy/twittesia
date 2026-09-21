import type { Metadata } from "next";

import { SessionProvider } from "@/features/auth/components/session-provider";
import { SettingsPage } from "@/features/settings/components/settings-page";
import { SETTINGS_SECTIONS } from "@/features/settings/constants/settings-sections";

export const metadata: Metadata = {
  title: "Twittesia | Settings",
};

export const generateStaticParams = () =>
  SETTINGS_SECTIONS.map((section) => ({ section: section.value }));

// Loaded directly, shared or refreshed: settings as a page rather than a dialog
export default function SettingsRoute({ params }: PageProps<"/settings/[section]">) {
  return (
    <SessionProvider>
      <SettingsPage params={params} />
    </SessionProvider>
  );
}
