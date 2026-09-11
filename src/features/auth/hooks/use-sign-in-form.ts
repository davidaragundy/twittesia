import { useState } from "react";

import { useSignInSocialMutation } from "@/features/auth/hooks/use-sign-in-social-mutation";

export type SignInMethod = "password" | "magic-link";

export const useSignInForm = () => {
  const [method, setMethod] = useState<SignInMethod>("password");
  const { mutate, isPending } = useSignInSocialMutation();

  const handleSignInWithGitHub = () => mutate({ provider: "github" });
  const handleSignInWithGoogle = () => mutate({ provider: "google" });

  // The toggle group reports an array; keep the last choice when it would empty out
  const onMethodChange = (value: unknown[]) => {
    const [next] = value;
    if (next === "password" || next === "magic-link") setMethod(next);
  };

  return { method, onMethodChange, isPending, handleSignInWithGitHub, handleSignInWithGoogle };
};
