import type { Metadata } from "next";
import { Suspense } from "react";

import { StartErrorToast } from "@/features/auth/components/start-error-toast";
import { LandingCallToAction } from "@/features/landing/components/landing-call-to-action";
import { LandingChat } from "@/features/landing/components/landing-chat";
import { LandingHero } from "@/features/landing/components/landing-hero";
import { LandingHighlights } from "@/features/landing/components/landing-highlights";
import { LandingLifespan } from "@/features/landing/components/landing-lifespan";
import { LandingName } from "@/features/landing/components/landing-name";
import { LandingPreview } from "@/features/landing/components/landing-preview";
import { LANDING_DESCRIPTION } from "@/features/landing/constants/landing-description";
import { LANDING_JSON_LD } from "@/features/landing/constants/landing-json-ld";
import { LANDING_TITLE } from "@/features/landing/constants/landing-title";

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
      <Suspense>
        <StartErrorToast />
      </Suspense>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(LANDING_JSON_LD).replace(/</g, "\\u003c"),
        }}
      />

      <div className="flex flex-col gap-16 sm:gap-20">
        <LandingHero />
        <LandingPreview />
      </div>

      <LandingHighlights />

      <LandingChat />

      <LandingLifespan />

      <LandingName />

      <LandingCallToAction />
    </div>
  );
}
