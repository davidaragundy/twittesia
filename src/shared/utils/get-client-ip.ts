import "server-only";

import { headers } from "next/headers";

// The address the request came from. Vercel sets x-real-ip itself and overwrites any
// x-forwarded-for a client sends, so neither can be spoofed there; running locally, there may be
// neither.
export const getClientIp = async () => {
  const requestHeaders = await headers();

  return (
    requestHeaders.get("x-real-ip") ??
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
};
