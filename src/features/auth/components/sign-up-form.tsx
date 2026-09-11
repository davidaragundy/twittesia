"use client";

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
import { Input } from "@/shared/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/shared/components/ui/input-group";
import { Spinner } from "@/shared/components/ui/spinner";
import { cn } from "@/shared/utils/cn";

import { AuthHeading } from "@/features/auth/components/auth-heading";
import { PasswordStrengthIndicator } from "@/features/auth/components/password-strength-indicator";
import { SocialButtons } from "@/features/auth/components/social-buttons";
import { TermsNotice } from "@/features/auth/components/terms-notice";
import { useSignUpForm } from "@/features/auth/hooks/use-sign-up-form";

export function SignUpForm({ className, ...props }: React.ComponentProps<"div">) {
  const { form, onSubmit, isPending, handleSignUpWithGithub, handleSignUpWithGoogle } =
    useSignUpForm();

  return (
    <div className={cn("flex flex-col gap-10", className)} {...props}>
      <AuthHeading
        title="Create your account"
        description="Here you can say whatever you want, nobody will give a f*ck 🌴"
      />
      <FieldGroup>
        <form id="sign-up-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field className="grid grid-cols-1 gap-7 sm:grid-cols-2 sm:gap-4">
              <Controller
                name="name"
                control={form.control}
                disabled={isPending}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="sign-up-form-name">Name</FieldLabel>
                    <Input
                      {...field}
                      id="sign-up-form-name"
                      aria-invalid={fieldState.invalid}
                      placeholder="David Aragundy"
                      autoComplete="name"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="username"
                control={form.control}
                disabled={isPending}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="sign-up-form-username">Username</FieldLabel>
                    <InputGroup>
                      <InputGroupAddon>
                        <InputGroupText>@</InputGroupText>
                      </InputGroupAddon>
                      <InputGroupInput
                        {...field}
                        id="sign-up-form-username"
                        aria-invalid={fieldState.invalid}
                        placeholder="davidaragundy"
                        autoComplete="username"
                      />
                    </InputGroup>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </Field>
            <Controller
              name="email"
              control={form.control}
              disabled={isPending}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="sign-up-form-email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="sign-up-form-email"
                    type="email"
                    aria-invalid={fieldState.invalid}
                    placeholder="david@aragundy.com"
                    autoComplete="email"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              disabled={isPending}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="sign-up-form-password">Password</FieldLabel>
                  <Input
                    {...field}
                    id="sign-up-form-password"
                    type="password"
                    aria-invalid={fieldState.invalid}
                    autoComplete="new-password"
                  />
                  {fieldState.isDirty && <PasswordStrengthIndicator password={field.value} />}
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Field>
              <Button type="submit" form="sign-up-form" disabled={isPending}>
                {isPending && <Spinner data-icon="inline-start" />}
                Create account
              </Button>
            </Field>
          </FieldGroup>
        </form>
        <FieldDescription className="text-center">Or continue with</FieldDescription>
        <SocialButtons
          action="Sign up"
          disabled={isPending}
          onGitHub={handleSignUpWithGithub}
          onGoogle={handleSignUpWithGoogle}
        />
        <FieldDescription className="text-center">
          Already have an account? <Link href="/sign-in">Sign in</Link>
        </FieldDescription>
      </FieldGroup>
      <TermsNotice />
    </div>
  );
}
