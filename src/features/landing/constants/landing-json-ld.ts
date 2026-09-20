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
  // What a search result can say Twittesia does, in the same words the page uses
  featureList: [
    "Posts that are deleted after 24 hours",
    "Comments and emoji reactions",
    "Images, video and audio",
    "Full-text search on Explore",
    "Pages that update live",
    "Private chats, encrypted in the browser and stored nowhere",
    "No account, no email address and no password",
  ],
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};
