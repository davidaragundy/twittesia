"use client";

import { SecurityLockIcon, UserIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Suspense } from "react";

import { NavButton } from "@/shared/components/nav-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/shared/components/ui/drawer";
import { FieldContent, FieldDescription, FieldTitle } from "@/shared/components/ui/field";
import { Spinner } from "@/shared/components/ui/spinner";
import { ToggleGroup, ToggleGroupItem } from "@/shared/components/ui/toggle-group";

import { ActiveSessionItemSkeleton } from "@/features/settings/components/active-session-item-skeleton";
import { ActiveSessions } from "@/features/settings/components/active-sessions";
import { ChangeEmailForm } from "@/features/settings/components/change-email-form";
import { ChangeNameForm } from "@/features/settings/components/change-name-form";
import { ChangePasswordForm } from "@/features/settings/components/change-password-form";
import { ChangeUsernameForm } from "@/features/settings/components/change-username-form";
import { GenerateBackupCodesForm } from "@/features/settings/components/generate-backup-codes-form";
import { ToggleTwoFactorForm } from "@/features/settings/components/toggle-two-factor-form";
import { useSettingsDialog } from "@/features/settings/hooks/use-settings-dialog";
import type { Sessions } from "@/features/settings/types";

const TITLE = "Settings";
const DESCRIPTION = "Manage your account and how you sign in.";

const SECTIONS = [
  { value: "account", label: "Account", icon: UserIcon },
  { value: "security", label: "Security", icon: SecurityLockIcon },
] as const;

type Props = {
  sessions: Promise<Sessions | null>;
};

export function SettingsDialog({ sessions }: Props) {
  const { isMobile, isOpen, tab, onOpenChange, onTabChange } = useSettingsDialog();

  // The same buttons as the app navigation, so active and hover look identical
  const navigation = (
    <nav aria-label="Settings sections" className="flex flex-col gap-2">
      {SECTIONS.map((section) => (
        <NavButton
          key={section.value}
          isActive={tab === section.value}
          onClick={() => onTabChange(section.value)}
        >
          <HugeiconsIcon icon={section.icon} />
          {section.label}
        </NavButton>
      ))}
    </nav>
  );

  const content =
    tab === "account" ? (
      <div className="flex flex-col gap-14">
        <SettingsSection title="Name" description="How you appear to other people.">
          <ChangeNameForm />
        </SettingsSection>
        <SettingsSection title="Username" description="Your unique handle.">
          <ChangeUsernameForm />
        </SettingsSection>
        <SettingsSection title="Email" description="Where we send account emails.">
          <ChangeEmailForm />
        </SettingsSection>
      </div>
    ) : (
      <div className="flex flex-col gap-14">
        <SettingsSection title="Password" description="Change the password you sign in with.">
          <ChangePasswordForm />
        </SettingsSection>
        <SettingsSection
          title="Two-factor authentication"
          description="Add a second step when you sign in."
        >
          <ToggleTwoFactorForm />
          <GenerateBackupCodesForm />
        </SettingsSection>
        <SettingsSection title="Active sessions" description="Devices signed in to your account.">
          <Suspense fallback={<ActiveSessionItemSkeleton />}>
            <ActiveSessions sessions={sessions} />
          </Suspense>
        </SettingsSection>
      </div>
    );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{TITLE}</DrawerTitle>
            <DrawerDescription>{DESCRIPTION}</DrawerDescription>
          </DrawerHeader>
          <div className="flex min-h-0 flex-col gap-10 overflow-y-auto px-4 pt-4 pb-12">
            <ToggleGroup
              aria-label="Settings sections"
              value={[tab]}
              onValueChange={(value) => onTabChange(value[0])}
              className="self-center"
            >
              {SECTIONS.map((section) => (
                <ToggleGroupItem key={section.value} value={section.value}>
                  <HugeiconsIcon icon={section.icon} />
                  {section.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            <Suspense fallback={<Spinner className="self-center" />}>{content}</Suspense>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{TITLE}</DialogTitle>
          <DialogDescription>{DESCRIPTION}</DialogDescription>
        </DialogHeader>
        <div className="flex gap-14">
          <div className="w-44 shrink-0">{navigation}</div>
          <div className="-mr-6 no-scrollbar max-h-[70vh] min-w-0 flex-1 overflow-y-auto pr-6">
            <Suspense fallback={<Spinner />}>{content}</Suspense>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

type SettingsSectionProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

function SettingsSection({ title, description, children }: SettingsSectionProps) {
  return (
    <section className="flex flex-col gap-8">
      <FieldContent>
        <FieldTitle>{title}</FieldTitle>
        <FieldDescription>{description}</FieldDescription>
      </FieldContent>
      {children}
    </section>
  );
}
