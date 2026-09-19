import { loadEnvConfig } from "@next/env";
import { Redis } from "@upstash/redis";

loadEnvConfig(process.cwd());

// Over HTTP, so a function holds no connection between requests. Reads UPSTASH_REDIS_REST_URL and
// UPSTASH_REDIS_REST_TOKEN. Values come back as the strings they were stored as: the client would
// otherwise parse anything that looks like JSON, and a name of "true" or a post that says "123"
// would come back as a boolean or a number.
export const redis = Redis.fromEnv({ automaticDeserialization: false });
