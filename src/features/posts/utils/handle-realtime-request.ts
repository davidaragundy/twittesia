import "server-only";

import { handle } from "@upstash/realtime";
import { NextResponse } from "next/server";

import { getSession } from "@/features/auth/queries/get-session";
import { realtime } from "@/features/posts/lib/realtime";

// The stream of events an open page listens on. An identity is required, as it is to read any of
// what the events are about.
export const handleRealtimeRequest = handle({
  realtime,
  middleware: async () => {
    if (!(await getSession())) {
      return NextResponse.json({ message: "You need an identity to do that" }, { status: 401 });
    }
  },
});
