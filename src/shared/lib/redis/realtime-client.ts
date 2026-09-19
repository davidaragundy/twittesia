import { Redis } from "@upstash/redis";

// A second client, for Upstash Realtime alone. It reads back what it wrote to the event stream,
// so it needs the parsing the app's own client turns off.
export const realtimeRedis = Redis.fromEnv();
