"use client";

import { Loading03Icon, ArrowReloadHorizontalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Controller } from "react-hook-form";

import { Button } from "@/shared/components/ui/button";
import { Field, FieldLabel, FieldDescription, FieldError } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { TypographyH4 } from "@/shared/components/ui/typography";

import { useGenerateBackupCodesForm } from "@/features/settings/hooks/use-generate-backup-codes-form";

export const GenerateBackupCodesForm = () => {
  const { form, onSubmit, isPending, isError, isTwoFactorEnabled, isGenerateBackupCodesDirty } =
    useGenerateBackupCodesForm();

  return (
    isTwoFactorEnabled && (
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <TypographyH4>Backup codes</TypographyH4>

        <div className="space-y-4">
          <Controller
            control={form.control}
            name="generateBackupCodes"
            render={({ field }) => (
              <Field>
                <div className="flex flex-wrap items-center justify-start gap-4">
                  <FieldLabel htmlFor={field.name}>Generate backup codes</FieldLabel>

                  <Button
                    id={field.name}
                    disabled={isPending}
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => field.onChange(true)}
                  >
                    Generate
                  </Button>
                </div>

                <FieldDescription>
                  Generate a set of backup codes to use if you lose your authenticator app. If you
                  already have backup codes, this will generate a new set and invalidate the old.
                </FieldDescription>
              </Field>
            )}
          />
        </div>

        {isGenerateBackupCodesDirty && (
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
                    In order to generate backup codes, please enter your password.
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
                  disabled={isPending}
                  type="submit"
                  variant={isError ? "destructive" : "default"}
                >
                  {isPending && <HugeiconsIcon icon={Loading03Icon} className="animate-spin" />}
                  {isError && <HugeiconsIcon icon={ArrowReloadHorizontalIcon} />}
                  Generate backup codes
                </Button>
              </Field>
            )}
          />
        )}
      </form>
    )
  );
};
