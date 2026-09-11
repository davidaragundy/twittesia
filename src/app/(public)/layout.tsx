import { cacheLife } from "next/cache";
import Link from "next/link";

import { SiteHeader } from "@/shared/components/site-header";
import { Button } from "@/shared/components/ui/button";

const REPOSITORY_URL = "https://github.com/davidaragundy/twittesia";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-auto flex min-h-svh w-full max-w-6xl flex-col px-6 sm:px-10 lg:px-16">
      <SiteHeader>
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
      </SiteHeader>

      <main className="flex flex-1 flex-col">{children}</main>

      <footer className="py-16">
        <div className="flex flex-col-reverse items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
          <p>
            © <CurrentYear /> Twittesia. Open source.
          </p>
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

// Part of the static shell, refreshed daily so the year rolls over on its own
async function CurrentYear() {
  "use cache";
  cacheLife("days");

  return new Date().getFullYear();
}
