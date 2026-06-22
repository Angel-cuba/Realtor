import { existsSync } from "node:fs";

if (existsSync("apps/web/.env.local")) {
  process.loadEnvFile("apps/web/.env.local");
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set. Add it to apps/web/.env.local");
}

const { db, listings, propertyMedia } = await import("./index");
const { asc, eq } = await import("drizzle-orm");

type AuditResult = {
  id: string;
  listingSlug: string;
  listingTitle: string;
  url: string;
  status: "empty" | "invalid-url" | "unsupported-protocol" | "http-error" | "not-image" | "network-error";
  detail: string;
};

const TIMEOUT_MS = 5_000;

async function fetchWithTimeout(url: string, init: RequestInit) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function checkImageUrl(url: string): Promise<Omit<AuditResult, "id" | "listingSlug" | "listingTitle" | "url"> | null> {
  const value = url.trim();
  if (!value) return { status: "empty", detail: "URL is empty" };
  if (value.startsWith("/")) return null;

  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    return { status: "invalid-url", detail: "URL cannot be parsed" };
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { status: "unsupported-protocol", detail: parsed.protocol };
  }

  try {
    let response = await fetchWithTimeout(value, { method: "HEAD" });
    if (response.status === 405 || response.status === 403) {
      response = await fetchWithTimeout(value, { method: "GET", headers: { range: "bytes=0-0" } });
    }

    if (!response.ok) {
      return { status: "http-error", detail: String(response.status) };
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (contentType && !contentType.toLowerCase().startsWith("image/")) {
      return { status: "not-image", detail: contentType };
    }

    return null;
  } catch (error) {
    return {
      status: "network-error",
      detail: error instanceof Error ? error.message : "Unknown network error",
    };
  }
}

const rows = await db
  .select({
    id: propertyMedia.id,
    url: propertyMedia.url,
    listingSlug: listings.slug,
    listingTitle: listings.title,
  })
  .from(propertyMedia)
  .innerJoin(listings, eq(propertyMedia.listingId, listings.id))
  .orderBy(asc(listings.slug), asc(propertyMedia.sortOrder));

const failures: AuditResult[] = [];

for (const row of rows) {
  const failure = await checkImageUrl(row.url);
  if (failure) {
    failures.push({ ...row, ...failure });
  }
}

if (failures.length === 0) {
  console.log("Checked " + rows.length + " image URLs. No broken remote URLs found.");
  process.exit(0);
}

console.log("Checked " + rows.length + " image URLs. Broken URLs: " + failures.length);
for (const failure of failures) {
  console.log(
    [
      failure.status,
      failure.detail,
      failure.listingSlug,
      failure.id,
      failure.url,
    ].join(" | ")
  );
}

process.exit(1);
