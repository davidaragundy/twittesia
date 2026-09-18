import { loadEnvConfig } from "@next/env";
import { Redis } from "@upstash/redis";

loadEnvConfig(process.cwd());

// Over HTTP, so a function holds no connection between requests. Reads UPSTASH_REDIS_REST_URL and
// UPSTASH_REDIS_REST_TOKEN.
export const redis = Redis.fromEnv();
