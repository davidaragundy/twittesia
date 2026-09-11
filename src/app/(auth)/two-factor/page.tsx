import type { Metadata } from "next";

import { TwoFactorForm } from "@/features/auth/components/two-factor-form";

export const metadata: Metadata = {
  title: "Twittesia | Two-factor",
  description: "Two-factor authentication for your account",
};

export default function TwoFactorPage() {
  return <TwoFactorForm />;
}
