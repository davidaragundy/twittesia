import "server-only";

import { NextResponse } from "next/server";

import { isRateLimited } from "@/shared/utils/is-rate-limited";

import { getSession } from "@/features/auth/queries/get-session";
import { searchRateLimits } from "@/features/explore/lib/search-rate-limits";
import { getSearchPage } from "@/features/explore/queries/get-search-page";
import { searchQuerySchema } from "@/features/explore/schemas/search-query-schema";
import { searchScopeSchema } from "@/features/explore/schemas/search-scope-schema";

// The results the browser asks for as it scrolls. It reads the session itself, so a signed-out
// request gets nothing.
export const handleSearchRequest = async (request: Request) => {
  const session = await getSession();

  if (!session)
    return NextResponse.json({ message: "You need an identity to do that" }, { status: 401 });

  if (await isRateLimited({ limits: searchRateLimits, identityId: session.user.id })) {
    return NextResponse.json({ message: "Too many searches at once" }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const { data, error } = await getSearchPage({
    query: searchQuerySchema.parse(searchParams.get("q") ?? ""),
    scope: searchScopeSchema.parse(searchParams.get("in")),
    offset: Number(searchParams.get("offset")) || 0,
    viewerId: session.user.id,
  });

  if (error) return NextResponse.json({ message: error.message }, { status: 500 });

  return NextResponse.json(data);
};
