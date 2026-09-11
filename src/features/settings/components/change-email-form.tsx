"use client";

import { Mail01Icon } from "@hugeicons/core-free-icons";
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

import { useChangeEmailForm } from "@/features/settings/hooks/use-change-email-form";

export function ChangeEmailForm() {
  const { form, canSubmit, onSubmit, isPending } = useChangeEmailForm();

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
              <InputGroup>
                <InputGroupAddon>
                  <HugeiconsIcon icon={Mail01Icon} />
                </InputGroupAddon>
                <InputGroupInput
                  {...field}
                  id="change-email-form-email"
                  type="email"
                  aria-invalid={fieldState.invalid}
                  placeholder="david@aragundy.com"
                  autoComplete="email"
                />
              </InputGroup>
              <FieldDescription>
                We use it to contact you. It is never shown publicly.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Field orientation="horizontal">
          <Button type="submit" form="change-email-form" disabled={!canSubmit || isPending}>
            {isPending && <Spinner data-icon="inline-start" />}
            Save email
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
