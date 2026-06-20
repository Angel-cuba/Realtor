import { existsSync } from "node:fs";
import { createHash } from "node:crypto";

if (existsSync("apps/web/.env.local")) {
  process.loadEnvFile("apps/web/.env.local");
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set. Add it to apps/web/.env.local");
}

const { db, listings, propertyMedia } = await import("./index");
const { and, eq, inArray, isNull, like, or } = await import("drizzle-orm");

const PHOTOS_PER_LISTING = 3;
const HOUSE_IMAGES = Array.from({ length: 12 }, (_, index) => "/images/realtor/const-" + (index + 1) + ".webp");

function deterministicId(seed: string) {
  const h = createHash("md5").update(seed).digest("hex");
  return h.slice(0, 8) + "-" + h.slice(8, 12) + "-" + h.slice(12, 16) + "-" + h.slice(16, 20) + "-" + h.slice(20, 32);
}

function imageForListing(slug: string, idx: number) {
  const hash = createHash("md5").update(slug).digest("hex");
  const start = Number.parseInt(hash.slice(0, 8), 16) % HOUSE_IMAGES.length;
  return HOUSE_IMAGES[(start + idx) % HOUSE_IMAGES.length];
}

const published = await db
  .select({ id: listings.id, slug: listings.slug })
  .from(listings)
  .where(eq(listings.status, "published"));

const publishedIds = published.map((listing) => listing.id);
const rows = published.flatMap((listing) =>
  Array.from({ length: PHOTOS_PER_LISTING }, (_, idx) => ({
    id: deterministicId(listing.slug + "-" + idx),
    listingId: listing.id,
    url: imageForListing(listing.slug, idx),
    alt: listing.slug + " property photo " + (idx + 1),
    sortOrder: idx,
  }))
);

try {
  if (publishedIds.length > 0) {
    await db
      .delete(propertyMedia)
      .where(
        and(
          inArray(propertyMedia.listingId, publishedIds),
          or(
            isNull(propertyMedia.url),
            eq(propertyMedia.url, ""),
            like(propertyMedia.url, "https://picsum.photos/%"),
            like(propertyMedia.url, "https://fastly.picsum.photos/%"),
            like(propertyMedia.url, "/images/realtor/const-%")
          )
        )
      );
  }

  for (const row of rows) {
    await db
      .insert(propertyMedia)
      .values(row)
      .onConflictDoUpdate({
        target: propertyMedia.id,
        set: { url: row.url, alt: row.alt, sortOrder: row.sortOrder, listingId: row.listingId },
      });
  }

  console.log("Seeded " + rows.length + " local home photos across " + published.length + " published listings.");
  process.exit(0);
} catch (error) {
  console.error("Image seed failed:", error);
  process.exit(1);
}
