import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense, use } from "react";

import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

export const metadata: Metadata = {
  title: "Twittesia | Reset Password",
  description: "Reset your password",
};

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { token } = use(searchParams);

  if (!token) return redirect("/forgot-password");

  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
