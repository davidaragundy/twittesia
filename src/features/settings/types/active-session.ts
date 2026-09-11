import type { auth } from "@/features/auth/lib/auth";

export type ActiveSession = Awaited<ReturnType<typeof auth.api.listSessions>>[number];
