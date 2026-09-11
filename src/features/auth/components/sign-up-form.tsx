"use client";

import { AtIcon, LockPasswordIcon, Mail01Icon, UserIcon } from "@hugeicons/core-free-icons";
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
import { PasswordStrengthIndicator } from "@/features/auth/components/password-strength-indicator";
import { SocialButtons } from "@/features/auth/components/social-buttons";
import { TermsNotice } from "@/features/auth/components/terms-notice";
import { useSignUpForm } from "@/features/auth/hooks/use-sign-up-form";

export function SignUpForm({ className, ...props }: React.ComponentProps<"div">) {
  const { form, onSubmit, isPending, handleSignUpWithGithub, handleSignUpWithGoogle } =
    useSignUpForm();

  return (
    <div className={cn("flex flex-col gap-12", className)} {...props}>
      <AuthHeading
        title="Create your account"
        description="Here you can say whatever you want, nobody will give a f*ck 🌴"
      />
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
                  <InputGroup>
                    <InputGroupAddon>
                      <HugeiconsIcon icon={UserIcon} />
                    </InputGroupAddon>
                    <InputGroupInput
                      {...field}
                      id="sign-up-form-name"
                      aria-invalid={fieldState.invalid}
                      placeholder="David Aragundy"
                      autoComplete="name"
                    />
                  </InputGroup>
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
                      <HugeiconsIcon icon={AtIcon} />
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
                <InputGroup>
                  <InputGroupAddon>
                    <HugeiconsIcon icon={Mail01Icon} />
                  </InputGroupAddon>
                  <InputGroupInput
                    {...field}
                    id="sign-up-form-email"
                    type="email"
                    aria-invalid={fieldState.invalid}
                    placeholder="david@aragundy.com"
                    autoComplete="email"
                  />
                </InputGroup>
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
                <InputGroup>
                  <InputGroupAddon>
                    <HugeiconsIcon icon={LockPasswordIcon} />
                  </InputGroupAddon>
                  <InputGroupInput
                    {...field}
                    id="sign-up-form-password"
                    type="password"
                    aria-invalid={fieldState.invalid}
                    autoComplete="new-password"
                  />
                </InputGroup>
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
      <div className="flex flex-col gap-8">
        <FieldDescription className="text-center">Or continue with</FieldDescription>
        <SocialButtons
          action="Sign up"
          disabled={isPending}
          onGitHub={handleSignUpWithGithub}
          onGoogle={handleSignUpWithGoogle}
        />
      </div>
      <FieldDescription className="text-center">
        Already have an account? <Link href="/sign-in">Sign in</Link>
      </FieldDescription>
      <TermsNotice />
    </div>
  );
}
