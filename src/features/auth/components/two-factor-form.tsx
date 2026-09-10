"use client";

import Link from "next/link";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Controller } from "react-hook-form";
import { HugeiconsIcon } from "@hugeicons/react";
import { Loading03Icon } from "@hugeicons/core-free-icons";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Field, FieldError } from "@/shared/components/ui/field";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/shared/components/ui/input-otp";
import { TypographyH1, TypographyP } from "@/shared/components/ui/typography";
import { cn } from "@/shared/utils/cn";

import { useTwoFactorForm } from "@/features/auth/hooks/use-two-factor-form";

export function TwoFactorForm({ className, ...props }: React.ComponentProps<"div">) {
  const { form, onSubmit, isPending } = useTwoFactorForm();

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-none bg-background shadow-none">
        <CardHeader className="text-center">
          <CardTitle>
            <TypographyH1>Two-factor authentication</TypographyH1>
          </CardTitle>

          <CardDescription>
            <TypographyP className="leading-normal">
              Enter your one-time password to continue 🧍
            </TypographyP>
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Controller
              control={form.control}
              name="code"
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  className="flex w-full flex-col items-center justify-center"
                >
                  <InputOTP
                    {...field}
                    id={field.name}
                    pattern={REGEXP_ONLY_DIGITS}
                    maxLength={6}
                    onComplete={form.handleSubmit(onSubmit)}
                    className="self-center"
                  >
                    <InputOTPGroup className="flex w-full justify-center">
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>

                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Button disabled={isPending} type="submit" className="mt-2 w-full">
              {isPending && <HugeiconsIcon icon={Loading03Icon} className="animate-spin" />}
              Verify
            </Button>
          </form>

          <div className="text-center text-sm">
            Don&apos;t have access to your authenticator app?{" "}
            <Link href="/recovery-code" className="underline underline-offset-4">
              Use recovery code
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
