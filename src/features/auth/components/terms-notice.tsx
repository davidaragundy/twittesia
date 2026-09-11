import Link from "next/link";

export function TermsNotice() {
  return (
    <p className="mt-6 px-6 text-center text-xs text-balance text-muted-foreground [&>a]:underline [&>a]:underline-offset-4 [&>a]:hover:text-foreground">
      By continuing, you agree to our <Link href="/terms">Terms of Service</Link> and{" "}
      <Link href="/privacy">Privacy Policy</Link>.
    </p>
  );
}
