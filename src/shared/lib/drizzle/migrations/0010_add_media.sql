CREATE TABLE "media" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"post_id" text,
	"comment_id" text,
	"pathname" text NOT NULL,
	"kind" text NOT NULL,
	"url" text,
	"content_type" text,
	"size" integer,
	"width" integer,
	"height" integer,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"attached_at" timestamp with time zone,
	CONSTRAINT "media_pathname_unique" UNIQUE("pathname")
);
--> statement-breakpoint
ALTER TABLE "media" ADD CONSTRAINT "media_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media" ADD CONSTRAINT "media_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media" ADD CONSTRAINT "media_comment_id_comment_id_fk" FOREIGN KEY ("comment_id") REFERENCES "public"."comment"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "media_postId_idx" ON "media" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "media_commentId_idx" ON "media" USING btree ("comment_id");--> statement-breakpoint
CREATE INDEX "media_userId_idx" ON "media" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "media_orphan_idx" ON "media" USING btree ("created_at") WHERE "media"."post_id" is null and "media"."comment_id" is null;