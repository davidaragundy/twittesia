"use client";

import { REGEXP_ONLY_DIGITS } from "input-otp";
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
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/shared/components/ui/input-otp";
import { Spinner } from "@/shared/components/ui/spinner";
import { cn } from "@/shared/utils/cn";

import { AuthHeading } from "@/features/auth/components/auth-heading";
import { useTwoFactorForm } from "@/features/auth/hooks/use-two-factor-form";

export function TwoFactorForm({ className, ...props }: React.ComponentProps<"div">) {
  const { form, onSubmit, isPending } = useTwoFactorForm();

  return (
    <div className={cn("flex flex-col gap-10", className)} {...props}>
      <AuthHeading
        title="Two-factor authentication"
        description="Enter the code from your authenticator app 🧍"
      />
      <form id="two-factor-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            name="code"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="two-factor-form-code">One-time password</FieldLabel>
                <InputOTP
                  {...field}
                  id="two-factor-form-code"
                  maxLength={6}
                  pattern={REGEXP_ONLY_DIGITS}
                  onComplete={form.handleSubmit(onSubmit)}
                  aria-invalid={fieldState.invalid}
                  disabled={isPending}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Field>
            <Button type="submit" form="two-factor-form" disabled={isPending}>
              {isPending && <Spinner data-icon="inline-start" />}
              Verify
            </Button>
            <FieldDescription className="text-center">
              Lost your authenticator app? <Link href="/recovery-code">Use a recovery code</Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
