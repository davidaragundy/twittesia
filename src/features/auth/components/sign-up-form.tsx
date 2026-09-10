"use client";

import {
  AtIcon,
  Loading03Icon,
  LockPasswordIcon,
  Mail01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
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

import { PasswordStrengthIndicator } from "@/features/auth/components/password-strength-indicator";
import { useSignUpForm } from "@/features/auth/hooks/use-sign-up-form";

export function SignUpForm({ className, ...props }: React.ComponentProps<"div">) {
  const { form, onSubmit, isPending, handleSignUpWithGithub, handleSignUpWithGoogle } =
    useSignUpForm();

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-none bg-background shadow-none">
        <CardHeader className="text-center">
          <CardTitle>
            <TypographyH1>Sign up</TypographyH1>
          </CardTitle>

          <CardDescription>
            <TypographyP className="leading-normal">
              Here you can say whatever you want, nobody will give a f*ck 🌴
            </TypographyP>
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-6">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button
              type="button"
              variant="secondary"
              disabled={isPending}
              onClick={handleSignUpWithGithub}
            >
              <svg
                role="img"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
              >
                <title>GitHub</title>
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
              GitHub
            </Button>

            <Button
              type="button"
              variant="secondary"
              disabled={isPending}
              onClick={handleSignUpWithGoogle}
            >
              <svg
                role="img"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
              >
                <title>Google</title>
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
              </svg>
              Google
            </Button>
          </div>

          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex items-start gap-4">
              <Controller
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Name</FieldLabel>

                    <div className="relative">
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        className="peer ps-9 shadow-none not-aria-invalid:border-none aria-invalid:text-destructive-foreground"
                        disabled={isPending}
                        placeholder={fieldState.invalid ? undefined : "David Aragundy"}
                      />

                      <div
                        className={cn(
                          "pointer-events-none absolute inset-y-0 inset-s-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50",
                          fieldState.invalid && "text-destructive-foreground",
                          fieldState.isDirty && !fieldState.invalid && "text-foreground",
                        )}
                      >
                        <HugeiconsIcon icon={UserIcon} size={16} aria-hidden="true" />
                      </div>
                    </div>
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="username"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Username</FieldLabel>

                    <div className="relative">
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        className="peer ps-9 shadow-none not-aria-invalid:border-none aria-invalid:text-destructive-foreground"
                        disabled={isPending}
                        placeholder={fieldState.invalid ? undefined : "davidaragundy"}
                      />

                      <div
                        className={cn(
                          "pointer-events-none absolute inset-y-0 inset-s-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50",
                          fieldState.invalid && "text-destructive-foreground",
                          fieldState.isDirty && !fieldState.invalid && "text-foreground",
                        )}
                      >
                        <HugeiconsIcon icon={AtIcon} size={16} aria-hidden="true" />
                      </div>
                    </div>
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
            </div>

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

            <Controller
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>

                  <div className="relative">
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      className="peer ps-9 shadow-none not-aria-invalid:border-none aria-invalid:text-destructive-foreground"
                      disabled={isPending}
                      type="password"
                      placeholder={fieldState.invalid ? undefined : "••••••••"}
                    />

                    <div
                      className={cn(
                        "pointer-events-none absolute inset-y-0 inset-s-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50",
                        fieldState.invalid && "text-destructive-foreground",
                        fieldState.isDirty && !fieldState.invalid && "text-foreground",
                      )}
                    >
                      <HugeiconsIcon icon={LockPasswordIcon} size={16} aria-hidden="true" />
                    </div>
                  </div>

                  <FieldError errors={[fieldState.error]} />

                  {fieldState.isDirty && <PasswordStrengthIndicator password={field.value} />}
                </Field>
              )}
            />

            <Button disabled={isPending} type="submit" className="mt-2 w-full">
              {isPending && <HugeiconsIcon icon={Loading03Icon} className="animate-spin" />}
              Sign up
            </Button>
          </form>

          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/sign-in" className="font-bold hover:underline hover:underline-offset-4">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
