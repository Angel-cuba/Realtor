import { existsSync } from "node:fs";
import { createHash } from "node:crypto";

if (existsSync("apps/web/.env.local")) {
  process.loadEnvFile("apps/web/.env.local");
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set. Add it to apps/web/.env.local");
}

const { db, listings, propertyMedia } = await import("./index");
const { eq, isNull, or } = await import("drizzle-orm");

const PHOTOS_PER_LISTING = 3;

function deterministicId(seed: string) {
  // md5 hex sliced into uuid-shape so it slots into the uuid column.
  const h = createHash("md5").update(seed).digest("hex");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20, 32)}`;
}

function picsumUrl(slug: string, idx: number) {
  return `https://picsum.photos/seed/${slug}-${idx}/1600/1100`;
}

const published = await db
  .select({ id: listings.id, slug: listings.slug })
  .from(listings)
  .where(eq(listings.status, "published"));

const rows = published.flatMap((listing) =>
  Array.from({ length: PHOTOS_PER_LISTING }, (_, idx) => ({
    id: deterministicId(`${listing.slug}-${idx}`),
    listingId: listing.id,
    url: picsumUrl(listing.slug, idx),
    alt: `${listing.slug} — photo ${idx + 1}`,
    sortOrder: idx,
  }))
);

try {
  for (const row of rows) {
    await db
      .insert(propertyMedia)
      .values(row)
      .onConflictDoUpdate({
        target: propertyMedia.id,
        set: { url: row.url, alt: row.alt, sortOrder: row.sortOrder, listingId: row.listingId },
      });
  }

  await db
    .delete(propertyMedia)
    .where(or(isNull(propertyMedia.url), eq(propertyMedia.url, "")));

  console.log(`Seeded ${rows.length} photos across ${published.length} published listings.`);
  process.exit(0);
} catch (error) {
  console.error("Image seed failed:", error);
  process.exit(1);
}
