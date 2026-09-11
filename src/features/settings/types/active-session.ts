import type { authClient } from "@/features/auth/lib/auth-client";

type ListSessionsResponse = Awaited<ReturnType<typeof authClient.listSessions>>;

export type ActiveSession = NonNullable<ListSessionsResponse["data"]>[number];
