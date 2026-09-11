import "server-only";

import { headers } from "next/headers";
import { cache } from "react";

import { auth } from "@/shared/lib/better-auth/server";

// Deduplicated per request, so every component asking for the session shares one lookup
export const getSession = cache(async () => auth.api.getSession({ headers: await headers() }));
