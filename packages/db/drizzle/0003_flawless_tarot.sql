CREATE TYPE "public"."user_role" AS ENUM('buyer', 'owner', 'agent', 'manager', 'admin');--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "role" "user_role" DEFAULT 'buyer' NOT NULL;