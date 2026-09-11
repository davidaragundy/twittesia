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

import { useMagicLinkForm } from "@/features/auth/hooks/use-magic-link-form";

export function MagicLinkForm() {
  const { form, onSubmit, isPending } = useMagicLinkForm();

  return (
    <form id="magic-link-form" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="email"
          control={form.control}
          disabled={isPending}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="magic-link-form-email">Email</FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <HugeiconsIcon icon={Mail01Icon} />
                </InputGroupAddon>
                <InputGroupInput
                  {...field}
                  id="magic-link-form-email"
                  type="email"
                  aria-invalid={fieldState.invalid}
                  placeholder="david@aragundy.com"
                  autoComplete="email"
                />
              </InputGroup>
              <FieldDescription>We&apos;ll email you a link that signs you in.</FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Field>
          <Button type="submit" form="magic-link-form" disabled={isPending}>
            {isPending && <Spinner data-icon="inline-start" />}
            Send magic link
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
