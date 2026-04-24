CREATE TABLE "roles" (
	"id" bigint PRIMARY KEY NOT NULL,
	"name" varchar(64) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"name" text PRIMARY KEY NOT NULL,
	"value" text NOT NULL
);
