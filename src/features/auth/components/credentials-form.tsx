"use client";

import Link from "next/link";
import { Controller } from "react-hook-form";

import { Button } from "@/shared/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { Spinner } from "@/shared/components/ui/spinner";

import { useCredentialsForm } from "@/features/auth/hooks/use-credentials-form";

export function CredentialsForm() {
  const { form, onSubmit, isPending } = useCredentialsForm();

  return (
    <form id="credentials-form" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="email"
          control={form.control}
          disabled={isPending}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="credentials-form-email">Email</FieldLabel>
              <Input
                {...field}
                id="credentials-form-email"
                type="email"
                aria-invalid={fieldState.invalid}
                placeholder="david@aragundy.com"
                autoComplete="email"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="password"
          control={form.control}
          disabled={isPending}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="flex items-center">
                <FieldLabel htmlFor="credentials-form-password">Password</FieldLabel>
                <Link
                  href="/forgot-password"
                  className="ml-auto text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input
                {...field}
                id="credentials-form-password"
                type="password"
                aria-invalid={fieldState.invalid}
                autoComplete="current-password"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Field>
          <Button type="submit" form="credentials-form" disabled={isPending}>
            {isPending && <Spinner data-icon="inline-start" />}
            Sign in
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
