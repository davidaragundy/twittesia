"use client";

import { AtIcon } from "@hugeicons/core-free-icons";
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

import { useChangeUsernameForm } from "@/features/settings/hooks/use-change-username-form";

export function ChangeUsernameForm() {
  const { form, canSubmit, onSubmit, isPending } = useChangeUsernameForm();

  return (
    <form id="change-username-form" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="username"
          control={form.control}
          disabled={isPending}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="change-username-form-username">Username</FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <HugeiconsIcon icon={AtIcon} />
                </InputGroupAddon>
                <InputGroupInput
                  {...field}
                  id="change-username-form-username"
                  aria-invalid={fieldState.invalid}
                  placeholder="davidaragundy"
                  autoComplete="username"
                />
              </InputGroup>
              <FieldDescription>
                Letters, numbers and underscores. It is how people find and mention you.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Field orientation="horizontal">
          <Button type="submit" form="change-username-form" disabled={!canSubmit || isPending}>
            {isPending && <Spinner data-icon="inline-start" />}
            Save username
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
