import { BubbleChatIcon, Edit02Icon, FavouriteIcon, GhostIcon } from "@hugeicons/core-free-icons";
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
import { BASE_URL } from "@/shared/constants";

const TITLE = "Twittesia — say it, and in 24 hours it's gone";
const DESCRIPTION =
  "Twittesia is an open-source social network where every post, comment and message has a lifespan of 24 hours, then is deleted for good.";

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
    description: "Share what's on your mind with the people who follow you.",
  },
  {
    icon: GhostIcon,
    title: "Ghosts",
    description: "Post anonymously. No profile, just the words.",
  },
  {
    icon: FavouriteIcon,
    title: "Close friends",
    description: "Share some posts with only the people closest to you.",
  },
  {
    icon: BubbleChatIcon,
    title: "Chats",
    description: "Talk in private, with messages that expire too.",
  },
];

const lifespan = [
  { time: "0h", label: "You post, comment or send a message." },
  { time: "24h", label: "It lives. People read and reply." },
  { time: "Expiry", label: "It's deleted for good. No archive." },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col gap-32 py-20 sm:gap-40 sm:py-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <section className="flex flex-col items-center gap-8 text-center">
        <Badge variant="ghost">Open source</Badge>
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
          Say it. In 24 hours, it&apos;s gone.
        </h1>
        <p className="max-w-md text-base text-balance text-muted-foreground sm:text-lg">
          A social network where every post, comment and message is deleted after a day.
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
        <ItemGroup className="grid gap-6 sm:grid-cols-2">
          {features.map((feature) => (
            <Item key={feature.title}>
              <ItemMedia variant="icon">
                <HugeiconsIcon icon={feature.icon} />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>
                  <h3>{feature.title}</h3>
                </ItemTitle>
                <ItemDescription>{feature.description}</ItemDescription>
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
          {lifespan.map((step) => (
            <li key={step.time} className="flex flex-col gap-1">
              <span className="text-2xl font-semibold tracking-tight">{step.time}</span>
              <span className="text-muted-foreground">{step.label}</span>
            </li>
          ))}
        </ol>
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
