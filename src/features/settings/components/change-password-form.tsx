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

import { PasswordStrengthIndicator } from "@/features/auth/components/password-strength-indicator";
import { useChangePasswordForm } from "@/features/settings/hooks/use-change-password-form";

export const ChangePasswordForm = () => {
  const { form, onSubmit, isPending } = useChangePasswordForm();

  const { errors, isDirty } = form.formState;
  const canSubmit = isDirty && !errors.newPassword;

  return (
    <form id="change-password-form" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="newPassword"
          control={form.control}
          disabled={isPending}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="change-password-form-new">New password</FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <HugeiconsIcon icon={LockPasswordIcon} />
                </InputGroupAddon>
                <InputGroupInput
                  {...field}
                  id="change-password-form-new"
                  type="password"
                  placeholder="********"
                  aria-invalid={fieldState.invalid}
                  autoComplete="new-password"
                />
              </InputGroup>
              <FieldDescription>Changing it signs you out of every other session.</FieldDescription>
              {(fieldState.isDirty || fieldState.isTouched) && (
                <PasswordStrengthIndicator password={field.value} />
              )}
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="currentPassword"
          control={form.control}
          disabled={isPending}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="change-password-form-current">Current password</FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <HugeiconsIcon icon={LockPasswordIcon} />
                </InputGroupAddon>
                <InputGroupInput
                  {...field}
                  id="change-password-form-current"
                  type="password"
                  placeholder="********"
                  aria-invalid={fieldState.invalid}
                  autoComplete="current-password"
                />
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Field orientation="horizontal">
          <Button type="submit" form="change-password-form" disabled={!canSubmit || isPending}>
            {isPending && <Spinner data-icon="inline-start" />}
            Change password
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
};
