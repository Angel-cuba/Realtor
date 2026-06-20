import { eq } from "drizzle-orm";
import { db, listings } from "@realtor/db";

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export async function uniqueListingSlug(base: string) {
  const root = slugify(base) || "listing";
  let candidate = root;
  let n = 1;
  while (true) {
    const [hit] = await db
      .select({ id: listings.id })
      .from(listings)
      .where(eq(listings.slug, candidate))
      .limit(1);
    if (!hit) return candidate;
    n += 1;
    candidate = `${root}-${n}`;
    if (n > 50) throw new Error("Could not allocate unique slug");
  }
}
