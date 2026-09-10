"use client";

import Link from "next/link";
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
import { TypographyH1, TypographyP } from "@/shared/components/ui/typography";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/utils/cn";

import { useRecoveryCodeForm } from "@/features/auth/hooks/use-recovery-code-form";

export function RecoveryCodeForm({ className, ...props }: React.ComponentProps<"div">) {
  const { form, onSubmit, isPending } = useRecoveryCodeForm();

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-none bg-background shadow-none">
        <CardHeader className="text-center">
          <CardTitle>
            <TypographyH1>Recovery code</TypographyH1>
          </CardTitle>

          <CardDescription>
            <TypographyP className="leading-normal">
              Enter the code from your recovery code list. Remember that each code can only be used
              once 🔐
            </TypographyP>
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Controller
              control={form.control}
              name="code"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="w-full">
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    disabled={isPending}
                    placeholder="abcde-fghij"
                  />
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
            Remember your credentials?{" "}
            <Link href="/sign-in" className="underline underline-offset-4">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
