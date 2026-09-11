"use client";

import Link from "next/link";

import { FieldDescription, FieldGroup } from "@/shared/components/ui/field";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { cn } from "@/shared/utils/cn";

import { AuthHeading } from "@/features/auth/components/auth-heading";
import { CredentialsForm } from "@/features/auth/components/credentials-form";
import { MagicLinkForm } from "@/features/auth/components/magic-link-form";
import { SocialButtons } from "@/features/auth/components/social-buttons";
import { TermsNotice } from "@/features/auth/components/terms-notice";
import { useSignInForm } from "@/features/auth/hooks/use-sign-in-form";

export function SignInForm({ className, ...props }: React.ComponentProps<"div">) {
  const { isPending, handleSignInWithGitHub, handleSignInWithGoogle } = useSignInForm();

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <AuthHeading title="Welcome back" description="We knew you would come back 😏" />
      <FieldGroup>
        <SocialButtons
          action="Sign in"
          disabled={isPending}
          onGitHub={handleSignInWithGitHub}
          onGoogle={handleSignInWithGoogle}
        />
        <FieldDescription className="text-center">Or continue with email</FieldDescription>
        <Tabs defaultValue="password">
          <TabsList variant="line" className="w-full">
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="magic-link">Magic link</TabsTrigger>
          </TabsList>
          <TabsContent value="password">
            <CredentialsForm />
          </TabsContent>
          <TabsContent value="magic-link">
            <MagicLinkForm />
          </TabsContent>
        </Tabs>
        <FieldDescription className="text-center">
          Don&apos;t have an account? <Link href="/sign-up">Sign up</Link>
        </FieldDescription>
      </FieldGroup>
      <TermsNotice />
    </div>
  );
}
