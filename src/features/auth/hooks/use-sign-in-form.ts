import { useState } from "react";

import type { SignInMethod } from "@/features/auth/types/sign-in-method";

export const useSignInForm = () => {
  const [method, setMethod] = useState<SignInMethod>("password");

  // The toggle group reports an array; keep the last choice when it would empty out
  const onMethodChange = (value: unknown[]) => {
    const [next] = value;
    if (next === "password" || next === "magic-link") setMethod(next);
  };

  return { method, onMethodChange };
};
