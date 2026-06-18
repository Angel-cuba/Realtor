import { defineConfig } from "drizzle-kit";
import { existsSync } from "fs";

// Load .env.local using Node 20.12+ native API (no extra deps needed)
if (existsSync("apps/web/.env.local")) {
  process.loadEnvFile("apps/web/.env.local");
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set. Add it to .env.local");
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./packages/db/src/schema.ts",
  out: "./packages/db/drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL
  }
});
