import { loadEnvConfig } from "@next/env";
import { defineConfig } from "drizzle-kit";

loadEnvConfig(process.cwd());

export default defineConfig({
  out: "./src/shared/lib/drizzle/migrations",
  schema: "./src/shared/lib/drizzle/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    // Migrations run over the direct connection; the pooled DATABASE_URL is for the app
    url: process.env.DATABASE_URL_UNPOOLED!,
  },
  strict: true,
  verbose: true,
});
