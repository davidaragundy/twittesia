import type { Metadata } from "next";

import { RecoveryCodeForm } from "@/features/auth/components/recovery-code-form";

export const metadata: Metadata = {
  title: "Twittesia | Recovery code",
  description: "Use recovery code to access your account.",
};

export default function RecoveryCodePage() {
  return <RecoveryCodeForm />;
}
