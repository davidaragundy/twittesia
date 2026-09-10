import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense, use } from "react";

import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

export const metadata: Metadata = {
  title: "Twittesia | Reset Password",
  description: "Reset your password",
};

//TODO: Implement ResetPasswordFormFallback, this shi is for search params
function ResetPasswordFormFallback() {
  return <></>;
}

export default function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { token } = use(searchParams);

  if (!token) return redirect("/forgot-password");

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Link href="/" className="flex items-center justify-center gap-2 font-medium">
        <div className="flex items-center justify-center">
          <Image
            src="/images/twittesia-logo-dark.svg"
            alt="Twittesia logo dark"
            width={24}
            height={24}
            className="hidden dark:block"
          />
          <Image
            src="/images/twittesia-logo-light.svg"
            alt="Twittesia logo light"
            width={24}
            height={24}
            className="block dark:hidden"
          />
        </div>
        Twittesia
      </Link>

      <Suspense fallback={<ResetPasswordFormFallback />}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
