"use client";

import { LockPasswordIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Controller } from "react-hook-form";

import { Button } from "@/shared/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/shared/components/ui/input-group";
import { Spinner } from "@/shared/components/ui/spinner";

import { useGenerateBackupCodesForm } from "@/features/settings/hooks/use-generate-backup-codes-form";

export const GenerateBackupCodesForm = () => {
  const { form, onSubmit, isPending, isTwoFactorEnabled } = useGenerateBackupCodesForm();

  if (!isTwoFactorEnabled) return null;

  return (
    <form id="generate-backup-codes-form" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="currentPassword"
          control={form.control}
          disabled={isPending}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="generate-backup-codes-form-password">Password</FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <HugeiconsIcon icon={LockPasswordIcon} />
                </InputGroupAddon>
                <InputGroupInput
                  {...field}
                  id="generate-backup-codes-form-password"
                  type="password"
                  aria-invalid={fieldState.invalid}
                  autoComplete="current-password"
                />
              </InputGroup>
              <FieldDescription>
                New codes replace the old ones. Use one to sign in if you lose your authenticator
                app.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Field orientation="horizontal">
          <Button type="submit" form="generate-backup-codes-form" disabled={isPending}>
            {isPending && <Spinner data-icon="inline-start" />}
            Generate backup codes
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
};
