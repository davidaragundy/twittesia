import type { Metadata } from "next";

import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";

export const metadata: Metadata = {
  title: "Twittesia | Forgot Password",
  description: "Reset your password",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
