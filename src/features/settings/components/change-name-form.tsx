"use client";

import { UserIcon } from "@hugeicons/core-free-icons";
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

import { useChangeNameForm } from "@/features/settings/hooks/use-change-name-form";

export function ChangeNameForm() {
  const { form, canSubmit, onSubmit, isPending } = useChangeNameForm();

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
              <InputGroup>
                <InputGroupAddon>
                  <HugeiconsIcon icon={UserIcon} />
                </InputGroupAddon>
                <InputGroupInput
                  {...field}
                  id="change-name-form-name"
                  aria-invalid={fieldState.invalid}
                  placeholder="David Aragundy"
                  autoComplete="name"
                />
              </InputGroup>
              <FieldDescription>
                This is your public display name. It can be your real name or a pseudonym.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Field orientation="horizontal">
          <Button type="submit" form="change-name-form" disabled={!canSubmit || isPending}>
            {isPending && <Spinner data-icon="inline-start" />}
            Save name
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
