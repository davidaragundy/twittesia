"use client";

import { LockPasswordIcon, MagicWand01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

import { FieldDescription } from "@/shared/components/ui/field";
import { ToggleGroup, ToggleGroupItem } from "@/shared/components/ui/toggle-group";
import { cn } from "@/shared/utils/cn";

import { AuthHeading } from "@/features/auth/components/auth-heading";
import { CredentialsForm } from "@/features/auth/components/credentials-form";
import { MagicLinkForm } from "@/features/auth/components/magic-link-form";
import { SocialButtons } from "@/features/auth/components/social-buttons";
import { TermsNotice } from "@/features/auth/components/terms-notice";
import { useSignInForm } from "@/features/auth/hooks/use-sign-in-form";

export function SignInForm({ className, ...props }: React.ComponentProps<"div">) {
  const { method, onMethodChange, isPending, handleSignInWithGitHub, handleSignInWithGoogle } =
    useSignInForm();

  return (
    <div className={cn("flex flex-col gap-12", className)} {...props}>
      <AuthHeading title="Welcome back" description="We knew you would come back 😏" />

      <div className="flex flex-col gap-10">
        <ToggleGroup
          aria-label="Sign-in method"
          value={[method]}
          onValueChange={onMethodChange}
          className="w-full"
        >
          <ToggleGroupItem value="password" className="flex-1">
            <HugeiconsIcon icon={LockPasswordIcon} />
            Password
          </ToggleGroupItem>
          <ToggleGroupItem value="magic-link" className="flex-1">
            <HugeiconsIcon icon={MagicWand01Icon} />
            Magic link
          </ToggleGroupItem>
        </ToggleGroup>

        {method === "password" ? <CredentialsForm /> : <MagicLinkForm />}
      </div>

      <div className="flex flex-col gap-8">
        <FieldDescription className="text-center">Or continue with</FieldDescription>
        <SocialButtons
          action="Sign in"
          disabled={isPending}
          onGitHub={handleSignInWithGitHub}
          onGoogle={handleSignInWithGoogle}
        />
      </div>

      <FieldDescription className="text-center">
        Don&apos;t have an account? <Link href="/sign-up">Sign up</Link>
      </FieldDescription>

      <TermsNotice />
    </div>
  );
}
