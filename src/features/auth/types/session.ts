import type { authClient } from "@/features/auth/lib/auth-client";

export type Session = typeof authClient.$Infer.Session;
