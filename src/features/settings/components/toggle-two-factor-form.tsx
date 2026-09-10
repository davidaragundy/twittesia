"use client";

import { Loading03Icon, ArrowReloadHorizontalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Controller } from "react-hook-form";

import { TypographyH4 } from "@/shared/components/typography";
import { Button } from "@/shared/components/ui/button";
import { Field, FieldLabel, FieldDescription, FieldError } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Switch } from "@/shared/components/ui/switch";

import { DownloadBackupCodesDialog } from "@/features/settings/components/download-backup-codes-dialog";
import { SetupTwoFactorDialog } from "@/features/settings/components/setup-two-factor-dialog";
import { useToggleTwoFactorForm } from "@/features/settings/hooks/use-toggle-two-factor-form";

export const ToggleTwoFactorForm = () => {
  const {
    form,
    onSubmit,
    isPending,
    isError,
    isSessionSuccess,
    isSessionLoading,
    isSessionError,
    refetchSession,
    isSessionRefetching,
    totpURI,
    setTotpURI,
    backupCodes,
    setBackupCodes,
    isSwitchDirty,
  } = useToggleTwoFactorForm();

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

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <TypographyH4 className="flex-1">Two-factor authentication</TypographyH4>

        <Controller
          control={form.control}
          name="enableTwoFactor"
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className="flex flex-row items-center justify-between rounded-lg border p-4"
            >
              <div className="space-y-0.5">
                <FieldLabel htmlFor={field.name} className="text-base">
                  Enable TOTP
                </FieldLabel>

                <FieldDescription>
                  Enable time-based one-time passwords (TOTP). This requires using an authenticator
                  app.
                </FieldDescription>
              </div>

              {isSessionLoading && <Skeleton className="h-5 w-10 rounded-full" />}

              {isSessionError && (
                <Button variant="outline" type="button" onClick={() => refetchSession()}>
                  Retry{" "}
                  {isSessionRefetching ? (
                    <HugeiconsIcon icon={Loading03Icon} className="animate-spin" />
                  ) : (
                    <HugeiconsIcon icon={ArrowReloadHorizontalIcon} />
                  )}
                </Button>
              )}

              {isSessionSuccess && (
                <Switch
                  id={field.name}
                  disabled={isPending}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            </Field>
          )}
        />

        {isSwitchDirty && (
          <Controller
            control={form.control}
            name="currentPassword"
            disabled={isPending}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="flex flex-col items-start gap-4 rounded-lg bg-destructive/40 p-4"
              >
                <div className="space-y-0.5">
                  <FieldLabel htmlFor={field.name} className="text-base">
                    Password
                  </FieldLabel>

                  <FieldDescription>
                    In order to {form.getValues("enableTwoFactor") ? "enable" : "disable"} 2FA,
                    please enter your password.
                  </FieldDescription>
                </div>

                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  type="password"
                  placeholder="••••••••"
                />
                <FieldError errors={[fieldState.error]} />

                <Button
                  variant={isError ? "destructive" : "default"}
                  disabled={isPending}
                  type="submit"
                >
                  {isPending && <HugeiconsIcon icon={Loading03Icon} className="animate-spin" />}
                  {isError && <HugeiconsIcon icon={ArrowReloadHorizontalIcon} />}
                  {form.getValues("enableTwoFactor") ? "Enable" : "Disable"} 2FA
                </Button>
              </Field>
            )}
          />
        )}
      </form>
    </>
  );
};
