import type { Metadata } from "next";

import { SignUpForm } from "@/features/auth/components/sign-up-form";

export const metadata: Metadata = {
  title: "Twittesia | Sign Up",
  description: "Sign up to Twittesia",
};

export default function SignUpPage() {
  return <SignUpForm />;
}
