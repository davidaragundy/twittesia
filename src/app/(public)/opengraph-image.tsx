import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

export const alt = "Twittesia — say it, and in 24 hours it's gone";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), "public/images/twittesia-logo-dark.svg"));
  const logoSrc = `data:image/svg+xml;base64,${logo.toString("base64")}`;

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
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        {/* oxlint-disable-next-line nextjs/no-img-element -- ImageResponse renders plain <img> only */}
        <img src={logoSrc} width={96} height={96} alt="" />
        <span style={{ fontSize: 64, fontWeight: 800 }}>Twittesia</span>
      </div>
      <div style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.1 }}>
        Say it. In 24 hours, it&apos;s gone.
      </div>
      <div style={{ fontSize: 32, color: "#a1a1a1" }}>
        Every post, comment and message is deleted after 24 hours.
      </div>
    </div>,
    size,
  );
}
