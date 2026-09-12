import { HugeiconsIcon } from "@hugeicons/react";
import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/shared/components/ui/item";

import { LANDING_DESCRIPTION } from "@/features/landing/constants/landing-description";
import { LANDING_HIGHLIGHTS } from "@/features/landing/constants/landing-highlights";
import { LANDING_JSON_LD } from "@/features/landing/constants/landing-json-ld";
import { LANDING_TITLE } from "@/features/landing/constants/landing-title";
import { LIFESPAN_STEPS } from "@/features/landing/constants/lifespan-steps";

export const metadata: Metadata = {
  title: { absolute: LANDING_TITLE },
  description: LANDING_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Twittesia",
    title: LANDING_TITLE,
    description: LANDING_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: LANDING_TITLE,
    description: LANDING_DESCRIPTION,
  },
};

export default function LandingPage() {
  return (
    <div className="flex flex-col gap-32 py-20 sm:gap-40 sm:py-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(LANDING_JSON_LD).replace(/</g, "\\u003c"),
        }}
      />

      <section className="flex flex-col items-center gap-8 text-center">
        <Badge variant="ghost">Open source</Badge>
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
          Say it. In 24 hours, it&apos;s gone.
        </h1>
        <p className="max-w-md text-base text-balance text-muted-foreground sm:text-lg">
          A social network where every post and comment is deleted after a day.
        </p>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <Button size="lg" render={<Link href="/sign-up" />} nativeButton={false}>
            Get started
          </Button>
          <Button size="lg" variant="ghost" render={<Link href="/sign-in" />} nativeButton={false}>
            Sign in
          </Button>
        </div>
      </section>

      <section aria-labelledby="features-title" className="flex flex-col gap-8">
        <h2 id="features-title" className="text-sm font-medium text-muted-foreground">
          What you can share
        </h2>
        <ItemGroup className="grid gap-8 sm:grid-cols-2">
          {LANDING_HIGHLIGHTS.map((highlight) => (
            <Item key={highlight.title}>
              <ItemMedia variant="icon">
                <HugeiconsIcon icon={highlight.icon} />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>
                  <h3>{highlight.title}</h3>
                </ItemTitle>
                <ItemDescription>{highlight.description}</ItemDescription>
              </ItemContent>
            </Item>
          ))}
        </ItemGroup>
      </section>

      <section aria-labelledby="lifespan-title" className="flex flex-col gap-8">
        <h2 id="lifespan-title" className="text-sm font-medium text-muted-foreground">
          The lifespan of everything
        </h2>
        <ol className="grid gap-10 sm:grid-cols-3">
          {LIFESPAN_STEPS.map((step) => (
            <li key={step.time} className="flex flex-col gap-1">
              <span className="text-2xl font-semibold tracking-tight">{step.time}</span>
              <span className="text-muted-foreground">{step.label}</span>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="name-title" className="flex flex-col gap-8">
        <h2 id="name-title" className="text-sm font-medium text-muted-foreground">
          Why Twittesia
        </h2>
        <div className="flex flex-col gap-4">
          <p className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Twitter <span className="text-muted-foreground">+</span> amnesia.
          </p>
          <p className="max-w-xl text-lg text-balance text-muted-foreground">
            A timeline that forgets. Say what you think today; by tomorrow it has faded, and
            yesterday&apos;s take stays in yesterday.
          </p>
        </div>
      </section>

      <section className="flex flex-col items-center gap-6 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
          Nothing to regret tomorrow.
        </h2>
        <Button size="lg" render={<Link href="/sign-up" />} nativeButton={false}>
          Join Twittesia
        </Button>
      </section>
    </div>
  );
}
