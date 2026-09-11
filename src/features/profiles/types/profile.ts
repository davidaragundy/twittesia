import type { user } from "@/shared/lib/drizzle/schema";

export type Profile = typeof user.$inferSelect;
