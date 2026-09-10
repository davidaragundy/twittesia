import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { SignUpForm } from "@/features/auth/components/sign-up-form";

export const metadata: Metadata = {
  title: "Twittesia | Sign Up",
  description: "Sign up to Twittesia",
};

export default function SignUpPage() {
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

      <SignUpForm />
    </div>
  );
}
