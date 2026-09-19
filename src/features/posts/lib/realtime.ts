import { Realtime } from "@upstash/realtime";

import { realtimeRedis } from "@/shared/lib/redis/realtime-client";

import { CONTENT_EVENTS_HISTORY } from "@/features/posts/constants/content-events-history";
import { CONTENT_EVENTS_SCHEMA } from "@/features/posts/constants/content-events-schema";

// Every change to a post or a comment, on one channel: the app is small enough that each open
// page reads them all and keeps the few that touch what it shows. Built on Redis streams, so a
// page that reconnects is given what it missed.
export const realtime = new Realtime({
  schema: CONTENT_EVENTS_SCHEMA,
  redis: realtimeRedis,
  history: CONTENT_EVENTS_HISTORY,
});
