"use client";

import { Loading03Icon, Mail01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
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
import { Field, FieldLabel, FieldError } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { TypographyH1, TypographyP } from "@/shared/components/ui/typography";
import { cn } from "@/shared/utils/cn";

import { useForgotPasswordForm } from "@/features/auth/hooks/use-forgot-password-form";

export function ForgotPasswordForm({ className, ...props }: React.ComponentProps<"div">) {
  const { form, onSubmit, isPending } = useForgotPasswordForm();

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-none bg-background shadow-none">
        <CardHeader className="text-center">
          <CardTitle>
            <TypographyH1>Forgot password</TypographyH1>
          </CardTitle>

          <CardDescription>
            <TypographyP className="leading-normal">
              Have you ever thought about using a password manager? 😒
            </TypographyP>
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>

                  <div className="relative">
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      className="peer ps-9 shadow-none not-aria-invalid:border-none aria-invalid:text-destructive-foreground"
                      type="email"
                      disabled={isPending}
                      placeholder={fieldState.invalid ? undefined : "david@aragundy.com"}
                    />

                    <div
                      className={cn(
                        "pointer-events-none absolute inset-y-0 inset-s-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50",
                        fieldState.invalid && "text-destructive-foreground",
                        fieldState.isDirty && !fieldState.invalid && "text-foreground",
                      )}
                    >
                      <HugeiconsIcon icon={Mail01Icon} size={16} aria-hidden="true" />
                    </div>
                  </div>

                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Button disabled={isPending} type="submit" className="mt-2 w-full">
              {isPending && <HugeiconsIcon icon={Loading03Icon} className="animate-spin" />}
              Send reset link
            </Button>
          </form>

          <div className="text-center text-sm">
            Do you remember now?{" "}
            <Link href="/sign-in" className="font-bold hover:underline hover:underline-offset-4">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
