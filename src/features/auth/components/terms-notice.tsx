import Link from "next/link";

import { FieldDescription } from "@/shared/components/ui/field";

export function TermsNotice() {
  return (
    <FieldDescription className="px-6 text-center">
      By continuing, you agree to our <Link href="/terms">Terms of Service</Link> and{" "}
      <Link href="/privacy">Privacy Policy</Link>.
    </FieldDescription>
  );
}
