import { SettingsDialog } from "@/features/settings/components/settings-dialog";
import { getSessions } from "@/features/settings/queries/get-sessions";

// Starts the active sessions read without waiting for it. It reads the request, so render
// this inside a <Suspense> boundary.
export function SettingsDialogWithSessions() {
  return <SettingsDialog sessions={getSessions()} />;
}
