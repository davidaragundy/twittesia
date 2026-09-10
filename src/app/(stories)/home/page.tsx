import type { Metadata } from "next";

import { TypographyH1 } from "@/shared/components/ui/typography";

export const metadata: Metadata = {
  title: "Twittesia | Home",
};

export default function HomePage() {
  return (
    <main className="flex flex-col gap-6">
      <TypographyH1>Home</TypographyH1>
      Posts...
    </main>
  );
}
