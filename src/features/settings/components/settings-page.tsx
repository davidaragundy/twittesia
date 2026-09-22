import Link from "next/link";
import { notFound } from "next/navigation";

import { Icon } from "@/shared/components/icon";
import { PageHeader } from "@/shared/components/page-header";
import { Panel } from "@/shared/components/panel";
import { Button } from "@/shared/components/ui/button";

import { SettingsContent } from "@/features/settings/components/settings-content";
import { SETTINGS_DIALOG_DESCRIPTION } from "@/features/settings/constants/settings-dialog-description";
import { SETTINGS_DIALOG_TITLE } from "@/features/settings/constants/settings-dialog-title";
import { SETTINGS_SECTIONS } from "@/features/settings/constants/settings-sections";
import { isSettingsTab } from "@/features/settings/utils/is-settings-tab";
import { toSettingsPath } from "@/features/settings/utils/to-settings-path";

interface Props {
  params: Promise<{ section: string }>;
}

// Settings as a page of their own: what /settings/<section> shows when it is loaded directly,
// shared or refreshed, rather than opened over another page
export async function SettingsPage({ params }: Props) {
  const { section } = await params;

  if (!isSettingsTab(section)) notFound();

  return (
    <div className="flex flex-col gap-10">
      <PageHeader title={SETTINGS_DIALOG_TITLE} description={SETTINGS_DIALOG_DESCRIPTION} />
      <nav aria-label="Settings sections" className="flex flex-wrap gap-2">
        {SETTINGS_SECTIONS.map((item) => (
          <Button
            key={item.value}
            variant={section === item.value ? "secondary" : "ghost"}
            aria-current={section === item.value ? "page" : undefined}
            render={<Link href={toSettingsPath({ section: item.value })} replace />}
            nativeButton={false}
          >
            <Icon icon={item.icon} />
            {item.label}
          </Button>
        ))}
      </nav>
      <Panel>
        <SettingsContent section={section} />
      </Panel>
    </div>
  );
}
