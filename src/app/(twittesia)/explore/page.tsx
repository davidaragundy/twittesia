import type { Metadata } from "next";

import { ExplorePage } from "@/features/explore/components/explore-page";

export const metadata: Metadata = {
  title: "Twittesia | Explore",
};

export default function ExploreRoute({ searchParams }: PageProps<"/explore">) {
  return <ExplorePage searchParams={searchParams} />;
}
