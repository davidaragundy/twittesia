"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { UserIdVerificationIcon, MagicWand01Icon } from "@hugeicons/core-free-icons";

import { CredentialsForm } from "@/features/auth/components/credentials-form";
import { MagicLinkForm } from "@/features/auth/components/magic-link-form";
import { useSignInSocialMutation } from "@/features/auth/hooks/use-sign-in-social-mutation";

export const useSignInForm = () => {
  const [signInMethod, setSignInMethod] = useState<"credentials" | "magicLink">("credentials");

  const { mutate, isPending } = useSignInSocialMutation();

  const handleSignInWithGitHub = () => mutate({ provider: "github" });

  const handleSignInWithGoogle = () => mutate({ provider: "google" });

  const toggleSignInMethod = () =>
    setSignInMethod(signInMethod === "credentials" ? "magicLink" : "credentials");

  const form = signInMethod === "credentials" ? <CredentialsForm /> : <MagicLinkForm />;

  const toggleSignInMethodButtonContent =
    signInMethod === "credentials" ? (
      <>
        <HugeiconsIcon icon={MagicWand01Icon} /> Magic Link
      </>
    ) : (
      <>
        <HugeiconsIcon icon={UserIdVerificationIcon} /> Credentials
      </>
    );

  return {
    form,
    isPending,
    signInMethod,
    setSignInMethod,
    toggleSignInMethod,
    toggleSignInMethodButtonContent,
    handleSignInWithGitHub,
    handleSignInWithGoogle,
  };
};
