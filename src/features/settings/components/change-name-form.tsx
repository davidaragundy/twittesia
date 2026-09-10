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

import { useChangeNameForm } from "@/features/settings/hooks/use-change-name-form";

export function ChangeNameForm() {
  const {
    form,
    canSubmit,
    onSubmit,
    isPending,
    isSessionLoading,
    isSessionError,
    refetchSession,
    isSessionRefetching,
  } = useChangeNameForm();

  return (
    <form id="change-name-form" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          disabled={isPending}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="change-name-form-name">Name</FieldLabel>
              {isSessionLoading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Input
                  {...field}
                  id="change-name-form-name"
                  aria-invalid={fieldState.invalid}
                  placeholder="David Aragundy"
                  autoComplete="name"
                />
              )}
              <FieldDescription>
                This is your public display name. It can be your real name or a pseudonym.
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
            <Button type="submit" form="change-name-form" disabled={!canSubmit || isPending}>
              {isPending && <Spinner data-icon="inline-start" />}
              Save name
            </Button>
          )}
        </Field>
      </FieldGroup>
    </form>
  );
}
