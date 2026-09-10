import { user } from "@/shared/lib/drizzle/schema";

export type Profile = typeof user.$inferSelect;

export type FeatureActionResponse<T, E extends string = string> = {
  data?: T;
  error?: {
    code?: E;
    message: string;
  };
};
