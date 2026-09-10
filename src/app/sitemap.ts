import type { MetadataRoute } from "next";

import { BASE_URL } from "@/shared/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE_URL}/sign-up`, changeFrequency: "yearly", priority: 0.8 },
    { url: `${BASE_URL}/sign-in`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${BASE_URL}/terms`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/privacy`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
