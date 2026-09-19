import type { InferRealtimeEvents } from "@upstash/realtime";

import type { realtime } from "@/features/posts/lib/realtime";

// The events, as types, for the browser: the import is erased at build time, so nothing of the
// server comes with it
export type ContentEvents = InferRealtimeEvents<typeof realtime>;
