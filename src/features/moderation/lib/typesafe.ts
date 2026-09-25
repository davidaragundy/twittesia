import "server-only";

import { TypeSafeClient } from "@typesafe-ai/sdk";

import { MODERATION_MODEL } from "@/features/moderation/constants/moderation-model";

let client: TypeSafeClient | null = null;

/**
 * The TypeSafe client, made on first use so that a build or a check without the key never has
 * to construct one. Server-only: the key never reaches a browser.
 *
 * Publishing waits on it, so it gives up quickly and retries once rather than holding a post back
 * for the SDK's default ten seconds per attempt.
 */
export const getTypesafe = () => {
  client ??= new TypeSafeClient({
    apiKey: process.env.TYPESAFEAI_API_KEY,
    defaultModel: MODERATION_MODEL,
    timeout: 4_000,
    retry: { maxRetries: 1 },
  });

  return client;
};
