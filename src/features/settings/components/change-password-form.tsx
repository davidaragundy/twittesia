"use client";

import { Loading03Icon, ArrowReloadHorizontalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Controller } from "react-hook-form";

import { TypographyH4 } from "@/shared/components/typography";
import { Button } from "@/shared/components/ui/button";
import { Field, FieldLabel, FieldDescription, FieldError } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";

import { PasswordStrengthIndicator } from "@/features/auth/components/password-strength-indicator";
import { useChangePasswordForm } from "@/features/settings/hooks/use-change-password-form";

export const ChangePasswordForm = () => {
  const { form, onSubmit, isPending, isError, isSessionSuccess } = useChangePasswordForm();

  const { errors, isDirty } = form.formState;

  const canSubmit = !errors.newPassword && isDirty;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <TypographyH4>Change password</TypographyH4>

      <Controller
        control={form.control}
        name="newPassword"
        disabled={isPending || !isSessionSuccess}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <div className="flex flex-wrap items-center justify-start gap-2">
              <FieldLabel htmlFor={field.name}>New password</FieldLabel>

              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                className="w-full sm:w-fit"
                type="password"
                placeholder="••••••••"
              />
            </div>

            <FieldDescription className="text-sm text-muted-foreground">
              If you change your password, all your active sessions will be logged out.
            </FieldDescription>

            {(fieldState.isDirty || fieldState.isTouched) && (
              <PasswordStrengthIndicator password={field.value} />
            )}
          </Field>
        )}
      />

      {canSubmit && (
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
                  Current password
                </FieldLabel>

                <FieldDescription>
                  In order to change your password, please enter your current password.
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
                Change password
              </Button>
            </Field>
          )}
        />
      )}
    </form>
  );
};
