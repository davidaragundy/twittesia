"use client";

import Link from "next/link";
import { Controller } from "react-hook-form";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { Spinner } from "@/shared/components/ui/spinner";
import { cn } from "@/shared/utils/cn";

import { useRecoveryCodeForm } from "@/features/auth/hooks/use-recovery-code-form";

export function RecoveryCodeForm({ className, ...props }: React.ComponentProps<"div">) {
  const { form, onSubmit, isPending } = useRecoveryCodeForm();

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Use a recovery code</CardTitle>
          <CardDescription>Each code from your list works only once 🔐</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="recovery-code-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="code"
                control={form.control}
                disabled={isPending}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="recovery-code-form-code">Recovery code</FieldLabel>
                    <Input
                      {...field}
                      id="recovery-code-form-code"
                      aria-invalid={fieldState.invalid}
                      placeholder="abcde-fghij"
                      autoComplete="one-time-code"
                    />
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
        </CardContent>
      </Card>
    </div>
  );
}
