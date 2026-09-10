import {
  BubbleChatIcon,
  Delete02Icon,
  Edit02Icon,
  FavouriteIcon,
  GhostIcon,
  GithubIcon,
  HourglassIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { ThemeSwitch } from "@/shared/components/theme-switch";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { BASE_URL } from "@/shared/constants";

const TITLE = "Twittesia — say it, and in 24 hours it's gone";
const DESCRIPTION =
  "Twittesia is an open-source social network where every post, comment and message has a lifespan of 24 hours, then is deleted for good.";
const REPOSITORY_URL = "https://github.com/davidaragundy/twittesia";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Twittesia",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Twittesia",
  url: BASE_URL,
  description: DESCRIPTION,
  applicationCategory: "SocialNetworkingApplication",
  operatingSystem: "Any",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

const features = [
  {
    icon: Edit02Icon,
    title: "Posts",
    description: "Share what's on your mind with your followers. It stays up for a day.",
  },
  {
    icon: GhostIcon,
    title: "Ghosts",
    description: "Post anonymously. A ghost shows no profile, so the words speak for themselves.",
  },
  {
    icon: FavouriteIcon,
    title: "Close friends",
    description: "Keep a list of close friends and share some posts with only them.",
  },
  {
    icon: BubbleChatIcon,
    title: "Chats",
    description: "Talk in private. Messages follow the same 24-hour rule as everything else.",
  },
];

const lifespan = [
  { icon: Edit02Icon, time: "0h", label: "You publish a post, a comment or a message." },
  { icon: HourglassIcon, time: "0–24h", label: "It lives. People read, comment and reply." },
  { icon: Delete02Icon, time: "24h", label: "Expiry. It is deleted for good — no archive." },
];

export default function LandingPage() {
  return (
    <div className="mx-auto flex min-h-svh w-full max-w-5xl flex-col px-6 md:px-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <header className="flex items-center justify-between gap-4 py-6">
        <Link href="/" className="flex items-center gap-2 font-medium">
          <Logo />
          Twittesia
        </Link>

        <nav className="flex items-center gap-2" aria-label="Account">
          <ThemeSwitch />
          <Button variant="ghost" render={<Link href="/sign-in" />} nativeButton={false}>
            Sign in
          </Button>
        </nav>
      </header>

      <main className="flex flex-1 flex-col gap-24 py-16 md:py-24">
        <section className="flex flex-col items-center gap-6 text-center">
          <Badge variant="outline">Open source</Badge>

          <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-balance md:text-6xl">
            Say it. In 24 hours, it&apos;s gone.
          </h1>

          <p className="max-w-xl text-lg text-balance text-muted-foreground">
            Twittesia is a social network where every post, comment and message has a lifespan of 24
            hours. Then it is deleted for good.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button size="lg" render={<Link href="/sign-up" />} nativeButton={false}>
              Create account
            </Button>
            <Button
              size="lg"
              variant="outline"
              render={<Link href="/sign-in" />}
              nativeButton={false}
            >
              Sign in
            </Button>
          </div>
        </section>

        <section aria-labelledby="features-title" className="flex flex-col gap-8">
          <h2 id="features-title" className="text-2xl font-semibold tracking-tight">
            Everything you need, nothing that sticks around
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((feature) => (
              <Card key={feature.title}>
                <CardHeader>
                  <HugeiconsIcon icon={feature.icon} aria-hidden="true" />
                  <CardTitle>
                    <h3>{feature.title}</h3>
                  </CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section aria-labelledby="lifespan-title" className="flex flex-col gap-8">
          <h2 id="lifespan-title" className="text-2xl font-semibold tracking-tight">
            The lifespan of everything you share
          </h2>

          <ol className="grid gap-4 md:grid-cols-3">
            {lifespan.map((step) => (
              <li key={step.time}>
                <Card>
                  <CardHeader>
                    <HugeiconsIcon icon={step.icon} aria-hidden="true" />
                    <CardTitle>{step.time}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{step.label}</p>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ol>
        </section>

        <section className="flex flex-col items-center gap-6 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-balance">
            Nothing to regret tomorrow.
          </h2>
          <Button size="lg" render={<Link href="/sign-up" />} nativeButton={false}>
            Join Twittesia
          </Button>
        </section>
      </main>

      <footer className="flex flex-col gap-6 pb-10">
        <Separator />

        <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>Twittesia is open source.</p>

          <nav className="flex items-center gap-2" aria-label="Legal and source">
            <Button variant="link" render={<Link href="/terms" />} nativeButton={false}>
              Terms
            </Button>
            <Button variant="link" render={<Link href="/privacy" />} nativeButton={false}>
              Privacy
            </Button>
            <Button
              variant="link"
              render={<a href={REPOSITORY_URL} target="_blank" rel="noreferrer" />}
              nativeButton={false}
            >
              <HugeiconsIcon icon={GithubIcon} data-icon="inline-start" aria-hidden="true" />
              GitHub
            </Button>
          </nav>
        </div>
      </footer>
    </div>
  );
}

function Logo() {
  return (
    <>
      <Image
        src="/images/twittesia-logo-dark.svg"
        alt=""
        width={24}
        height={24}
        className="hidden dark:block"
        loading="eager"
      />
      <Image
        src="/images/twittesia-logo-light.svg"
        alt=""
        width={24}
        height={24}
        className="block dark:hidden"
        loading="eager"
      />
    </>
  );
}
