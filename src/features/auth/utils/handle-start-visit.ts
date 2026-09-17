import "server-only";

import { NextResponse } from "next/server";

import { getSession } from "@/features/auth/queries/get-session";

// Someone, or something, arriving at the start route without asking for an identity: a bookmark, a
// prefetch, a crawler. Nothing is minted; they are sent where they would have been anyway.
export const handleStartVisit = async (request: Request) =>
  NextResponse.redirect(new URL((await getSession()) ? "/home" : "/", request.url));
