"use client";

import { LockPasswordIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
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
import { cn } from "@/shared/utils/cn";

import { AuthHeading } from "@/features/auth/components/auth-heading";
import { PasswordStrengthIndicator } from "@/features/auth/components/password-strength-indicator";
import { useResetPasswordForm } from "@/features/auth/hooks/use-reset-password-form";

export function ResetPasswordForm({ className, ...props }: React.ComponentProps<"div">) {
  const { form, onSubmit, isPending } = useResetPasswordForm();

  return (
    <div className={cn("flex flex-col gap-10", className)} {...props}>
      <AuthHeading
        title="Reset your password"
        description="Pick a new password for your account."
      />
      <form id="reset-password-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            name="password"
            control={form.control}
            disabled={isPending}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="reset-password-form-password">New password</FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <HugeiconsIcon icon={LockPasswordIcon} />
                  </InputGroupAddon>
                  <InputGroupInput
                    {...field}
                    id="reset-password-form-password"
                    type="password"
                    aria-invalid={fieldState.invalid}
                    autoComplete="new-password"
                  />
                </InputGroup>
                {fieldState.isDirty && <PasswordStrengthIndicator password={field.value} />}
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="confirmPassword"
            control={form.control}
            disabled={isPending}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="reset-password-form-confirm">Confirm password</FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <HugeiconsIcon icon={LockPasswordIcon} />
                  </InputGroupAddon>
                  <InputGroupInput
                    {...field}
                    id="reset-password-form-confirm"
                    type="password"
                    aria-invalid={fieldState.invalid}
                    autoComplete="new-password"
                  />
                </InputGroup>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Field>
            <Button type="submit" form="reset-password-form" disabled={isPending}>
              {isPending && <Spinner data-icon="inline-start" />}
              Reset password
            </Button>
            <FieldDescription className="text-center">
              Remember it now? <Link href="/sign-in">Sign in</Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
