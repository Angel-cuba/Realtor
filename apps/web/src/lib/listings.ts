import type { PropertyListing } from "@realtor/domain";
import { and, asc, count, eq, inArray } from "drizzle-orm";
import {
  agents,
  db,
  listings as listingsTable,
  properties,
  propertyMedia,
  savedListings,
  userProfiles
} from "@realtor/db";

export type ListingRow = {
  listing: typeof listingsTable.$inferSelect;
  property: typeof properties.$inferSelect;
  agent: typeof agents.$inferSelect | null;
  profile: typeof userProfiles.$inferSelect | null;
};

async function getMediaByListingId(listingIds: string[]) {
  if (listingIds.length === 0) return new Map<string, string[]>();

  const rows = await db
    .select()
    .from(propertyMedia)
    .where(inArray(propertyMedia.listingId, listingIds))
    .orderBy(asc(propertyMedia.sortOrder));

  return rows.reduce((mediaByListing, media) => {
    const urls = mediaByListing.get(media.listingId) ?? [];
    urls.push(media.url);
    mediaByListing.set(media.listingId, urls);
    return mediaByListing;
  }, new Map<string, string[]>());
}

export async function mapListingRows(rows: ListingRow[]) {
  const mediaByListing = await getMediaByListingId(rows.map((row) => row.listing.id));

  return rows.map(({ agent, listing, profile, property }): PropertyListing => {
    const media = mediaByListing.get(listing.id) ?? [];

    return {
      id: listing.id,
      slug: listing.slug,
      title: listing.title,
      listingType: listing.listingType,
      propertyType: property.propertyType,
      status: listing.status,
      city: property.city,
      neighborhood: property.neighborhood,
      addressSummary: `${property.neighborhood}, ${property.city}`,
      price: listing.price,
      currency: listing.currency === "EUR" ? "EUR" : "USD",
      beds: property.beds,
      baths: property.baths,
      areaSqft: property.areaSqft,
      ...(property.lotSqft ? { lotSqft: property.lotSqft } : {}),
      image: media[0] ?? "",
      gallery: media.slice(1),
      tags: listing.tags,
      agentName: profile?.displayName ?? "Realtor advisor",
      agentTitle: agent?.title ?? "Property advisor",
      description: listing.summary,
      highlights: listing.highlights
    };
  });
}

export const LISTINGS_PAGE_SIZE = 24;

export async function getListingsByType(
  type: "sale" | "rent",
  options: { page?: number; pageSize?: number } = {}
) {
  const pageSize = options.pageSize ?? LISTINGS_PAGE_SIZE;
  const page = Math.max(1, options.page ?? 1);
  const offset = (page - 1) * pageSize;

  const where = and(eq(listingsTable.listingType, type), eq(listingsTable.status, "published"));

  const [[{ total }], rows] = await Promise.all([
    db.select({ total: count() }).from(listingsTable).where(where),
    db
      .select({
        listing: listingsTable,
        property: properties,
        agent: agents,
        profile: userProfiles
      })
      .from(listingsTable)
      .innerJoin(properties, eq(listingsTable.propertyId, properties.id))
      .leftJoin(agents, eq(listingsTable.agentId, agents.id))
      .leftJoin(userProfiles, eq(agents.userProfileId, userProfiles.id))
      .where(where)
      .orderBy(asc(listingsTable.publishedAt), asc(listingsTable.slug))
      .limit(pageSize)
      .offset(offset),
  ]);

  return { listings: await mapListingRows(rows), total };
}

export async function getListingBySlug(slug: string) {
  const rows = await db
    .select({
      listing: listingsTable,
      property: properties,
      agent: agents,
      profile: userProfiles
    })
    .from(listingsTable)
    .innerJoin(properties, eq(listingsTable.propertyId, properties.id))
    .leftJoin(agents, eq(listingsTable.agentId, agents.id))
    .leftJoin(userProfiles, eq(agents.userProfileId, userProfiles.id))
    .where(eq(listingsTable.slug, slug))
    .limit(1);

  const [listing] = await mapListingRows(rows);
  return listing;
}

export async function getPublishedListingBySlug(slug: string) {
  const rows = await db
    .select({
      listing: listingsTable,
      property: properties,
      agent: agents,
      profile: userProfiles
    })
    .from(listingsTable)
    .innerJoin(properties, eq(listingsTable.propertyId, properties.id))
    .leftJoin(agents, eq(listingsTable.agentId, agents.id))
    .leftJoin(userProfiles, eq(agents.userProfileId, userProfiles.id))
    .where(and(eq(listingsTable.slug, slug), eq(listingsTable.status, "published")))
    .limit(1);

  const [listing] = await mapListingRows(rows);
  return listing;
}

export async function getFeaturedListings() {
  const rows = await db
    .select({
      listing: listingsTable,
      property: properties,
      agent: agents,
      profile: userProfiles
    })
    .from(listingsTable)
    .innerJoin(properties, eq(listingsTable.propertyId, properties.id))
    .leftJoin(agents, eq(listingsTable.agentId, agents.id))
    .leftJoin(userProfiles, eq(agents.userProfileId, userProfiles.id))
    .where(eq(listingsTable.status, "published"))
    .orderBy(asc(listingsTable.publishedAt), asc(listingsTable.slug))
    .limit(4);

  return mapListingRows(rows);
}

export async function getListingsForAgent(agentId: string) {
  const rows = await db
    .select({
      slug: listingsTable.slug,
      title: listingsTable.title,
      listingType: listingsTable.listingType,
      status: listingsTable.status,
      price: listingsTable.price,
      currency: listingsTable.currency,
      propertyType: properties.propertyType,
      city: properties.city,
      neighborhood: properties.neighborhood,
    })
    .from(listingsTable)
    .innerJoin(properties, eq(listingsTable.propertyId, properties.id))
    .where(eq(listingsTable.agentId, agentId))
    .orderBy(asc(listingsTable.title));

  return rows;
}

export async function getPublishedListingSlugs() {
  const rows = await db
    .select({ slug: listingsTable.slug })
    .from(listingsTable)
    .where(eq(listingsTable.status, "published"))
    .orderBy(asc(listingsTable.publishedAt), asc(listingsTable.slug));

  return rows.map((row) => row.slug);
}

export async function getSavedListingIds(userId: string | null): Promise<Set<string>> {
  if (!userId) return new Set();
  const rows = await db
    .select({ listingId: savedListings.listingId })
    .from(savedListings)
    .where(eq(savedListings.userId, userId));
  return new Set(rows.map((r) => r.listingId));
}

export function filterListings(
  items: PropertyListing[],
  params: Record<string, string | string[] | undefined>
) {
  let result = items;

  const q = (params.q as string | undefined)?.toLowerCase().trim();
  if (q) {
    result = result.filter(
      (l) =>
        l.city.toLowerCase().includes(q) ||
        l.neighborhood.toLowerCase().includes(q) ||
        l.addressSummary.toLowerCase().includes(q)
    );
  }

  const budget = params.budget as string | undefined;
  if (budget === "500k") result = result.filter((l) => l.price <= 500_000);
  if (budget === "1m") result = result.filter((l) => l.price > 500_000 && l.price <= 1_000_000);
  if (budget === "1m+") result = result.filter((l) => l.price > 1_000_000);

  return result;
}
