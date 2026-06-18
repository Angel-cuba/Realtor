import type { PropertyListing } from "@realtor/domain";
import { and, asc, eq, inArray } from "drizzle-orm";
import {
  agents,
  db,
  listings as listingsTable,
  properties,
  propertyMedia,
  userProfiles
} from "@realtor/db";

type ListingRow = {
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

async function mapListingRows(rows: ListingRow[]) {
  const mediaByListing = await getMediaByListingId(rows.map((row) => row.listing.id));

  return rows.map(({ agent, listing, profile, property }): PropertyListing => {
    const media = mediaByListing.get(listing.id) ?? [];

    return {
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

export async function getListingsByType(type: "sale" | "rent") {
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
    .where(and(eq(listingsTable.listingType, type), eq(listingsTable.status, "published")))
    .orderBy(asc(listingsTable.publishedAt), asc(listingsTable.slug));

  return mapListingRows(rows);
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

export async function getPublishedListingSlugs() {
  const rows = await db
    .select({ slug: listingsTable.slug })
    .from(listingsTable)
    .where(eq(listingsTable.status, "published"))
    .orderBy(asc(listingsTable.publishedAt), asc(listingsTable.slug));

  return rows.map((row) => row.slug);
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
