import { redirect } from "next/navigation";

import { SETTINGS_SECTIONS } from "@/features/settings/constants/settings-sections";
import { toSettingsPath } from "@/features/settings/utils/to-settings-path";

export default function Page() {
  redirect(toSettingsPath({ section: SETTINGS_SECTIONS[0].value }));
}
