"use client";

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
import { Input } from "@/shared/components/ui/input";
import { Spinner } from "@/shared/components/ui/spinner";
import { cn } from "@/shared/utils/cn";

import { AuthHeading } from "@/features/auth/components/auth-heading";
import { useForgotPasswordForm } from "@/features/auth/hooks/use-forgot-password-form";

export function ForgotPasswordForm({ className, ...props }: React.ComponentProps<"div">) {
  const { form, onSubmit, isPending } = useForgotPasswordForm();

  return (
    <div className={cn("flex flex-col gap-10", className)} {...props}>
      <AuthHeading
        title="Forgot your password?"
        description="Have you ever thought about using a password manager? 😒"
      />
      <form id="forgot-password-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            name="email"
            control={form.control}
            disabled={isPending}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="forgot-password-form-email">Email</FieldLabel>
                <Input
                  {...field}
                  id="forgot-password-form-email"
                  type="email"
                  aria-invalid={fieldState.invalid}
                  placeholder="david@aragundy.com"
                  autoComplete="email"
                />
                <FieldDescription>We&apos;ll email you a link to reset it.</FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Field>
            <Button type="submit" form="forgot-password-form" disabled={isPending}>
              {isPending && <Spinner data-icon="inline-start" />}
              Send reset link
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
