import { BASE_URL } from "@/shared/constants/base-url";

import { LANDING_DESCRIPTION } from "@/features/landing/constants/landing-description";

// Structured data search engines read to describe Twittesia as an app
export const LANDING_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Twittesia",
  url: BASE_URL,
  description: LANDING_DESCRIPTION,
  applicationCategory: "SocialNetworkingApplication",
  operatingSystem: "Any",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};
