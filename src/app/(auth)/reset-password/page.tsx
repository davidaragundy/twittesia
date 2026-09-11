import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

export const metadata: Metadata = {
  title: "Twittesia | Reset Password",
  description: "Reset your password",
};

// The page itself prerenders; only the token check waits for the request
export default function ResetPasswordPage({ searchParams }: PageProps<"/reset-password">) {
  return (
    <Suspense>
      <ResetPasswordGate searchParams={searchParams} />
    </Suspense>
  );
}

async function ResetPasswordGate({
  searchParams,
}: Pick<PageProps<"/reset-password">, "searchParams">) {
  const { token } = await searchParams;

  if (!token) redirect("/forgot-password");

  return <ResetPasswordForm />;
}
