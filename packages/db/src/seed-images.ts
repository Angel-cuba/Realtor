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
const IMAGE_WIDTH = 1280;
const IMAGE_HEIGHT = 900;
const HOUSE_PHOTOS = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3",
  "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be",
  "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9",
  "https://images.unsplash.com/photo-1605146769289-440113cc3d00",
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811",
  "https://images.unsplash.com/photo-1598228723793-52759bba239c",
  "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83"
];

function deterministicId(seed: string) {
  const h = createHash("md5").update(seed).digest("hex");
  return h.slice(0, 8) + "-" + h.slice(8, 12) + "-" + h.slice(12, 16) + "-" + h.slice(16, 20) + "-" + h.slice(20, 32);
}

function deterministicLock(seed: string) {
  const h = createHash("md5").update(seed).digest("hex");
  return (Number.parseInt(h.slice(0, 10), 16) % 2_000_000_000) + 1;
}

function houseImageUrl(slug: string, idx: number) {
  const photo = HOUSE_PHOTOS[deterministicLock(slug + "-" + idx) % HOUSE_PHOTOS.length];
  return photo + "?auto=format&fit=crop&w=" + IMAGE_WIDTH + "&h=" + IMAGE_HEIGHT + "&q=80";
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
    url: houseImageUrl(listing.slug, idx),
    alt: listing.slug + " home photo " + (idx + 1),
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
            like(propertyMedia.url, "https://loremflickr.com/%"),
            like(propertyMedia.url, "https://images.unsplash.com/%"),
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

  console.log("Seeded " + rows.length + " remote home photos across " + published.length + " published listings.");
  process.exit(0);
} catch (error) {
  console.error("Image seed failed:", error);
  process.exit(1);
}
