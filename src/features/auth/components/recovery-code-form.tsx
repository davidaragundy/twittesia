"use client";

import { Key01Icon } from "@hugeicons/core-free-icons";
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
import { useRecoveryCodeForm } from "@/features/auth/hooks/use-recovery-code-form";

export function RecoveryCodeForm({ className, ...props }: React.ComponentProps<"div">) {
  const { form, onSubmit, isPending } = useRecoveryCodeForm();

  return (
    <div className={cn("flex flex-col gap-10", className)} {...props}>
      <AuthHeading
        title="Use a recovery code"
        description="Each code from your list works only once 🔐"
      />
      <form id="recovery-code-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            name="code"
            control={form.control}
            disabled={isPending}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="recovery-code-form-code">Recovery code</FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <HugeiconsIcon icon={Key01Icon} />
                  </InputGroupAddon>
                  <InputGroupInput
                    {...field}
                    id="recovery-code-form-code"
                    aria-invalid={fieldState.invalid}
                    placeholder="abcde-fghij"
                    autoComplete="one-time-code"
                  />
                </InputGroup>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Field>
            <Button type="submit" form="recovery-code-form" disabled={isPending}>
              {isPending && <Spinner data-icon="inline-start" />}
              Verify
            </Button>
            <FieldDescription className="text-center">
              Remember your password? <Link href="/sign-in">Sign in</Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
