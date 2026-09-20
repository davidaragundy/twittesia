import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";

import { Providers } from "@/shared/components/providers";
import { BASE_URL } from "@/shared/constants/base-url";
import { cn } from "@/shared/utils/cn";

import "@/shared/styles/globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

// Rendered rich text has its own typeface, which the typeset presets point at
const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  applicationName: "Twittesia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("font-sans", inter.variable, geist.variable, geistMono.variable)}
    >
      <body>
        <Providers>{children}</Providers>

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
