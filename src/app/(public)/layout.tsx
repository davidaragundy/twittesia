import Link from "next/link";

import { CurrentYear } from "@/shared/components/current-year";
import { SiteHeader } from "@/shared/components/site-header";
import { Button } from "@/shared/components/ui/button";
import { REPOSITORY_URL } from "@/shared/constants/repository-url";

import { StartButton } from "@/features/auth/components/start-button";

// The pages here are static, and the footer's year is read as they render: rendering them again
// daily keeps it right on the first of January without a deploy
export const revalidate = 86400;

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-auto flex min-h-svh w-full max-w-6xl flex-col px-6 sm:px-10 lg:px-16">
      <SiteHeader>
        <StartButton className="hidden sm:inline-flex" />
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
