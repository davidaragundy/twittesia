import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

export const alt = "Twittesia — say it, and in 24 hours it's gone";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The same typeface as the site, read once when the module loads
const fontDirectory = join(process.cwd(), "node_modules/@fontsource/inter/files");
const interRegular = readFile(join(fontDirectory, "inter-latin-400-normal.woff"));
const interSemiBold = readFile(join(fontDirectory, "inter-latin-600-normal.woff"));
const logo = readFile(join(process.cwd(), "public/images/twittesia-logo-dark.svg"));

export default async function OpengraphImage() {
  const logoSrc = `data:image/svg+xml;base64,${(await logo).toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 40,
        padding: 96,
        background: "#0a0a0a",
        color: "#fafafa",
        fontFamily: "Inter",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        {/* oxlint-disable-next-line nextjs/no-img-element -- ImageResponse renders plain <img> only */}
        <img src={logoSrc} width={88} height={88} alt="" />
        <span style={{ fontSize: 56, fontWeight: 600, letterSpacing: "-0.02em" }}>Twittesia</span>
      </div>
      <div style={{ fontSize: 72, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1.05 }}>
        Say it. In 24 hours, it&apos;s gone.
      </div>
      <div style={{ fontSize: 32, fontWeight: 400, color: "#a1a1a1" }}>
        Twitter, with amnesia. Every post, comment and message is deleted after a day.
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Inter", data: await interRegular, weight: 400, style: "normal" },
        { name: "Inter", data: await interSemiBold, weight: 600, style: "normal" },
      ],
    },
  );
}
