DROP TABLE "two_factor" CASCADE;--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "two_factor_enabled";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "follower_count";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "following_count";