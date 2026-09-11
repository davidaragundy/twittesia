import Link from "next/link";

import { Logo } from "@/shared/components/logo";
import { ThemeSwitch } from "@/shared/components/theme-switch";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";

const REPOSITORY_URL = "https://github.com/davidaragundy/twittesia";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-auto flex min-h-svh w-full max-w-5xl flex-col px-4 sm:px-6">
      <header className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-medium">
          <Logo />
          Twittesia
        </Link>

        <nav aria-label="Account" className="flex items-center gap-2">
          <Button variant="ghost" render={<Link href="/sign-in" />} nativeButton={false}>
            Sign in
          </Button>
          <Button
            className="hidden sm:inline-flex"
            render={<Link href="/sign-up" />}
            nativeButton={false}
          >
            Get started
          </Button>
          <ThemeSwitch />
        </nav>
      </header>

      <main className="flex flex-1 flex-col">{children}</main>

      <footer className="flex flex-col gap-4 py-8">
        <Separator />
        <div className="flex flex-col-reverse items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Twittesia. Open source.</p>
          <nav aria-label="Legal and source" className="flex items-center gap-1">
            <Button variant="link" size="sm" render={<Link href="/terms" />} nativeButton={false}>
              Terms
            </Button>
            <Button variant="link" size="sm" render={<Link href="/privacy" />} nativeButton={false}>
              Privacy
            </Button>
            <Button
              variant="link"
              size="sm"
              render={<a href={REPOSITORY_URL} target="_blank" rel="noreferrer" />}
              nativeButton={false}
            >
              GitHub
            </Button>
          </nav>
        </div>
      </footer>
    </div>
  );
}
