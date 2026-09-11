import type { Metadata } from "next";

import { SignInForm } from "@/features/auth/components/sign-in-form";

export const metadata: Metadata = {
  title: "Twittesia | Sign In",
  description: "Sign in to Twittesia",
};

export default function SignInPage() {
  return <SignInForm />;
}
