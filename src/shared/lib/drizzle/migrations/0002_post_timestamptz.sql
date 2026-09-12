ALTER TABLE "post" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "post" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "post" ALTER COLUMN "expires_at" SET DATA TYPE timestamp with time zone;