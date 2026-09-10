"use client";

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
import {
  FieldContent,
  FieldDescription,
  FieldSeparator,
  FieldTitle,
} from "@/shared/components/ui/field";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";

import { ActiveSessions } from "@/features/settings/components/active-sessions";
import { ChangeEmailForm } from "@/features/settings/components/change-email-form";
import { ChangeNameForm } from "@/features/settings/components/change-name-form";
import { ChangePasswordForm } from "@/features/settings/components/change-password-form";
import { ChangeUsernameForm } from "@/features/settings/components/change-username-form";
import { GenerateBackupCodesForm } from "@/features/settings/components/generate-backup-codes-form";
import { ToggleTwoFactorForm } from "@/features/settings/components/toggle-two-factor-form";
import { useSettingsDialog } from "@/features/settings/hooks/use-settings-dialog";

const TITLE = "Settings";
const DESCRIPTION = "Manage your account and how you sign in.";

export function SettingsDialog() {
  const { isMobile, isOpen, tab, onOpenChange, onTabChange } = useSettingsDialog();

  const content = (
    <Tabs value={tab} onValueChange={onTabChange}>
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <div className="flex flex-col gap-6">
          <SettingsSection title="Name" description="How you appear to other people.">
            <ChangeNameForm />
          </SettingsSection>
          <FieldSeparator />
          <SettingsSection title="Username" description="Your unique handle.">
            <ChangeUsernameForm />
          </SettingsSection>
          <FieldSeparator />
          <SettingsSection title="Email" description="Where we send account emails.">
            <ChangeEmailForm />
          </SettingsSection>
        </div>
      </TabsContent>
      <TabsContent value="security">
        <div className="flex flex-col gap-6">
          <SettingsSection title="Password" description="Change the password you sign in with.">
            <ChangePasswordForm />
          </SettingsSection>
          <FieldSeparator />
          <SettingsSection
            title="Two-factor authentication"
            description="Add a second step when you sign in."
          >
            <ToggleTwoFactorForm />
            <GenerateBackupCodesForm />
          </SettingsSection>
          <FieldSeparator />
          <SettingsSection title="Active sessions" description="Devices signed in to your account.">
            <ActiveSessions />
          </SettingsSection>
        </div>
      </TabsContent>
    </Tabs>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{TITLE}</DrawerTitle>
            <DrawerDescription>{DESCRIPTION}</DrawerDescription>
          </DrawerHeader>
          <div className="overflow-y-auto p-4">{content}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{TITLE}</DialogTitle>
          <DialogDescription>{DESCRIPTION}</DialogDescription>
        </DialogHeader>
        <div className="-mx-6 no-scrollbar max-h-[70vh] overflow-y-auto px-6">{content}</div>
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
    <section className="flex flex-col gap-4">
      <FieldContent>
        <FieldTitle>{title}</FieldTitle>
        <FieldDescription>{description}</FieldDescription>
      </FieldContent>
      {children}
    </section>
  );
}
