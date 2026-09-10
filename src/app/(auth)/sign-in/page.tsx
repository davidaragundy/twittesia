import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { SignInForm } from "@/features/auth/components/sign-in-form";

export const metadata: Metadata = {
  title: "Twittesia | Sign In",
  description: "Sign in to Twittesia",
};

export default function SignInPage() {
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

      <SignInForm />
    </div>
  );
}
