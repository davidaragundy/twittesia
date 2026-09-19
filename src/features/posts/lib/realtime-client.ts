"use client";

import { createRealtime } from "@upstash/realtime/client";

import type { ContentEvents } from "@/features/posts/types/content-events";

// The typed hook every page subscribes with: the event names and their payloads come from the
// same schema the server emits against
export const { useRealtime } = createRealtime<ContentEvents>();
