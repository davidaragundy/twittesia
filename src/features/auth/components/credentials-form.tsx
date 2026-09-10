"use client";

import Link from "next/link";
import { Controller } from "react-hook-form";
import { HugeiconsIcon } from "@hugeicons/react";
import { Loading03Icon, LockPasswordIcon, Mail01Icon } from "@hugeicons/core-free-icons";

import { Button } from "@/shared/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/utils/cn";

import { useCredentialsForm } from "@/features/auth/hooks/use-credentials-form";

export function CredentialsForm() {
  const { form, onSubmit, isPending } = useCredentialsForm();

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <Controller
        control={form.control}
        name="email"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Email</FieldLabel>

            <div className="relative">
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                className="peer ps-9 shadow-none not-aria-invalid:border-none aria-invalid:text-destructive-foreground"
                disabled={isPending}
                placeholder={fieldState.invalid ? undefined : "david@aragundy.com"}
              />

              <div
                className={cn(
                  "pointer-events-none absolute inset-y-0 inset-s-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50",
                  fieldState.invalid && "text-destructive-foreground",
                  fieldState.isDirty && !fieldState.invalid && "text-foreground",
                )}
              >
                <HugeiconsIcon icon={Mail01Icon} size={16} aria-hidden="true" />
              </div>
            </div>

            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="password"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>
              Password
              <Link
                prefetch
                href="/forgot-password"
                className="ml-auto text-xs text-foreground underline-offset-4 hover:underline"
              >
                Forgot your password?
              </Link>
            </FieldLabel>

            <div className="relative">
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                className="peer ps-9 shadow-none not-aria-invalid:border-none aria-invalid:text-destructive-foreground"
                disabled={isPending}
                type="password"
                placeholder={fieldState.invalid ? undefined : "••••••••"}
              />

              <div
                className={cn(
                  "pointer-events-none absolute inset-y-0 inset-s-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50",
                  fieldState.invalid && "text-destructive-foreground",
                  fieldState.isDirty && !fieldState.invalid && "text-foreground",
                )}
              >
                <HugeiconsIcon icon={LockPasswordIcon} size={16} aria-hidden="true" />
              </div>
            </div>

            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />

      <Button disabled={isPending} type="submit" className="mt-2 w-full">
        {isPending && <HugeiconsIcon icon={Loading03Icon} className="animate-spin" />}
        Sign in
      </Button>
    </form>
  );
}
