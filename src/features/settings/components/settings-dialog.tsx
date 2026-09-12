"use client";

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

import { ActiveSessions } from "@/features/settings/components/active-sessions";
import { ChangeEmailForm } from "@/features/settings/components/change-email-form";
import { ChangeNameForm } from "@/features/settings/components/change-name-form";
import { ChangePasswordForm } from "@/features/settings/components/change-password-form";
import { ChangeUsernameForm } from "@/features/settings/components/change-username-form";
import { DeleteAccount } from "@/features/settings/components/delete-account";
import { GenerateBackupCodesForm } from "@/features/settings/components/generate-backup-codes-form";
import { ToggleTwoFactorForm } from "@/features/settings/components/toggle-two-factor-form";
import { SETTINGS_DIALOG_DESCRIPTION } from "@/features/settings/constants/settings-dialog-description";
import { SETTINGS_DIALOG_TITLE } from "@/features/settings/constants/settings-dialog-title";
import { SETTINGS_SECTIONS } from "@/features/settings/constants/settings-sections";
import { useSettingsDialog } from "@/features/settings/hooks/use-settings-dialog";

export function SettingsDialog() {
  const { isMobile, isOpen, tab, onOpenChange, onTabChange } = useSettingsDialog();

  // The same buttons as the app navigation, so active and hover look identical
  const navigation = (
    <nav aria-label="Settings sections" className="flex flex-col gap-2">
      {SETTINGS_SECTIONS.map((section) => (
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
      // Each of these forms is a single field, so its own label and description head it
      <div className="flex flex-col gap-14">
        <ChangeNameForm />
        <ChangeUsernameForm />
        <ChangeEmailForm />

        <SettingsSection
          title="Delete account"
          description="Leave Twittesia and take your profile and posts with you."
        >
          <DeleteAccount />
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
          <ActiveSessions />
        </SettingsSection>
      </div>
    );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{SETTINGS_DIALOG_TITLE}</DrawerTitle>
            <DrawerDescription>{SETTINGS_DIALOG_DESCRIPTION}</DrawerDescription>
          </DrawerHeader>
          <div className="flex min-h-0 flex-col gap-10 overflow-y-auto px-4 pt-4 pb-12">
            <ToggleGroup
              aria-label="Settings sections"
              value={[tab]}
              onValueChange={(value) => onTabChange(value[0])}
              className="self-center"
            >
              {SETTINGS_SECTIONS.map((section) => (
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
      <DialogContent className="gap-10 p-10 sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{SETTINGS_DIALOG_TITLE}</DialogTitle>
          <DialogDescription>{SETTINGS_DIALOG_DESCRIPTION}</DialogDescription>
        </DialogHeader>
        <div className="flex gap-20">
          <div className="w-44 shrink-0">{navigation}</div>
          <div className="-mr-10 no-scrollbar max-h-[70vh] min-w-0 flex-1 overflow-y-auto pr-10">
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
