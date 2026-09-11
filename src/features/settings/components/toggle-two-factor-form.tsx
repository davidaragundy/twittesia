"use client";

import { LockPasswordIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Controller } from "react-hook-form";

import { Button } from "@/shared/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/shared/components/ui/input-group";
import { Spinner } from "@/shared/components/ui/spinner";
import { Switch } from "@/shared/components/ui/switch";

import { DownloadBackupCodesDialog } from "@/features/settings/components/download-backup-codes-dialog";
import { SetupTwoFactorDialog } from "@/features/settings/components/setup-two-factor-dialog";
import { useToggleTwoFactorForm } from "@/features/settings/hooks/use-toggle-two-factor-form";

export const ToggleTwoFactorForm = () => {
  const {
    form,
    onSubmit,
    isPending,
    totpURI,
    setTotpURI,
    backupCodes,
    setBackupCodes,
    isSwitchDirty,
  } = useToggleTwoFactorForm();

  const action = form.watch("enableTwoFactor") ? "Enable" : "Disable";

  return (
    <>
      <SetupTwoFactorDialog
        isOpen={!!totpURI}
        closeDialog={() => setTotpURI("")}
        totpURI={totpURI}
      />
      <DownloadBackupCodesDialog
        isOpen={!!backupCodes.length && !totpURI}
        closeDialog={() => setBackupCodes([])}
        backupCodes={backupCodes}
      />

      <form id="toggle-two-factor-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            name="enableTwoFactor"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                <FieldContent>
                  <FieldLabel htmlFor="toggle-two-factor-form-enable">Authenticator app</FieldLabel>
                  <FieldDescription>
                    Ask for a one-time password from an authenticator app when you sign in.
                  </FieldDescription>
                </FieldContent>
                <Switch
                  id="toggle-two-factor-form-enable"
                  name={field.name}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isPending}
                  aria-invalid={fieldState.invalid}
                />
              </Field>
            )}
          />
          {isSwitchDirty && (
            <>
              <Controller
                name="currentPassword"
                control={form.control}
                disabled={isPending}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="toggle-two-factor-form-password">Password</FieldLabel>
                    <InputGroup>
                      <InputGroupAddon>
                        <HugeiconsIcon icon={LockPasswordIcon} />
                      </InputGroupAddon>
                      <InputGroupInput
                        {...field}
                        id="toggle-two-factor-form-password"
                        type="password"
                        placeholder="********"
                        aria-invalid={fieldState.invalid}
                        autoComplete="current-password"
                      />
                    </InputGroup>
                    <FieldDescription>
                      Enter your password to {action.toLowerCase()} two-factor authentication.
                    </FieldDescription>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Field orientation="horizontal">
                <Button type="submit" form="toggle-two-factor-form" disabled={isPending}>
                  {isPending && <Spinner data-icon="inline-start" />}
                  {action} two-factor authentication
                </Button>
              </Field>
            </>
          )}
        </FieldGroup>
      </form>
    </>
  );
};
