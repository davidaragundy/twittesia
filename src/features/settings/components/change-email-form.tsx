"use client";

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
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Spinner } from "@/shared/components/ui/spinner";

import { useChangeEmailForm } from "@/features/settings/hooks/use-change-email-form";

export function ChangeEmailForm() {
  const {
    form,
    canSubmit,
    onSubmit,
    isPending,
    isSessionLoading,
    isSessionError,
    refetchSession,
    isSessionRefetching,
  } = useChangeEmailForm();

  return (
    <form id="change-email-form" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="email"
          control={form.control}
          disabled={isPending}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="change-email-form-email">Email</FieldLabel>
              {isSessionLoading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Input
                  {...field}
                  id="change-email-form-email"
                  type="email"
                  aria-invalid={fieldState.invalid}
                  placeholder="david@aragundy.com"
                  autoComplete="email"
                />
              )}
              <FieldDescription>
                We use it to contact you. It is never shown publicly.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Field orientation="horizontal">
          {isSessionError ? (
            <Button type="button" variant="outline" onClick={() => refetchSession()}>
              {isSessionRefetching && <Spinner data-icon="inline-start" />}
              Retry
            </Button>
          ) : (
            <Button type="submit" form="change-email-form" disabled={!canSubmit || isPending}>
              {isPending && <Spinner data-icon="inline-start" />}
              Save email
            </Button>
          )}
        </Field>
      </FieldGroup>
    </form>
  );
}
