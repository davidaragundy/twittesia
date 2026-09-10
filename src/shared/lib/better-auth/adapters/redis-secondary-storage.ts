import { SecondaryStorage } from "better-auth";

import { redis } from "@/shared/lib/upstash/redis";

// Upstash deserializes JSON on read, so values come back as whatever type they parse to
const toStoredString = (value: unknown) => {
  // Handle different return types from Redis
  if (value === null || value === undefined) {
    return null;
  }

  // If it's already a string, return it
  if (typeof value === "string") {
    return value;
  }

  // If it's an object, stringify it
  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  // Convert to string for any other type
  return String(value);
};

export const redisSecondaryStorage: SecondaryStorage = {
  async get(key: string) {
    try {
      return toStoredString(await redis.get(key));
    } catch (error) {
      console.error("Redis get error:", error);
      return null;
    }
  },

  async getAndDelete(key: string) {
    try {
      return toStoredString(await redis.getdel(key));
    } catch (error) {
      console.error("Redis getAndDelete error:", error);
      return null;
    }
  },

  async increment(key: string, ttl: number) {
    try {
      // The TTL applies only when INCR creates the key, so the window never slides
      const [value] = await redis.multi().incr(key).expire(key, ttl, "NX").exec();

      return value;
    } catch (error) {
      console.error("Redis increment error:", error);
      throw error;
    }
  },

  async set(key: string, value: string, ttl?: number) {
    try {
      // Ensure value is a string
      const stringValue = typeof value === "string" ? value : JSON.stringify(value);

      if (ttl) {
        // Set with TTL in seconds
        await redis.set(key, stringValue, { ex: ttl });
      } else {
        // Set without TTL
        await redis.set(key, stringValue);
      }
    } catch (error) {
      console.error("Redis set error:", error);
      throw error;
    }
  },

  async delete(key: string) {
    try {
      await redis.del(key);
    } catch (error) {
      console.error("Redis delete error:", error);
      throw error;
    }
  },
};
