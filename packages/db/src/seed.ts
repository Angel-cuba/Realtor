import { existsSync } from "node:fs";

if (existsSync("apps/web/.env.local")) {
  process.loadEnvFile("apps/web/.env.local");
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set. Add it to apps/web/.env.local");
}

const { agents, db, listings, properties, propertyMedia, userProfiles } = await import("./index");

const agentProfiles = [
  {
    id: "00000000-0000-4000-8000-000000000101",
    clerkUserId: "seed_maya_collins",
    displayName: "Maya Collins",
    email: "maya.collins@example.com",
    phone: "+1 512 555 0101"
  },
  {
    id: "00000000-0000-4000-8000-000000000102",
    clerkUserId: "seed_noah_bennett",
    displayName: "Noah Bennett",
    email: "noah.bennett@example.com",
    phone: "+1 305 555 0102"
  },
  {
    id: "00000000-0000-4000-8000-000000000103",
    clerkUserId: "seed_lena_garcia",
    displayName: "Lena Garcia",
    email: "lena.garcia@example.com",
    phone: "+1 720 555 0103"
  }
];

const seedAgents = [
  {
    id: "00000000-0000-4000-8000-000000000201",
    userProfileId: agentProfiles[0].id,
    slug: "maya-collins",
    title: "Luxury property advisor",
    licenseNumber: "TX-RE-0101",
    bio: "Luxury residential advisor focused on private tours and premium homes.",
    active: true
  },
  {
    id: "00000000-0000-4000-8000-000000000202",
    userProfileId: agentProfiles[1].id,
    slug: "noah-bennett",
    title: "Senior buyer specialist",
    licenseNumber: "FL-RE-0102",
    bio: "Buyer specialist for urban residences and high-service buildings.",
    active: true
  },
  {
    id: "00000000-0000-4000-8000-000000000203",
    userProfileId: agentProfiles[2].id,
    slug: "lena-garcia",
    title: "Neighborhood specialist",
    licenseNumber: "CO-RE-0103",
    bio: "Neighborhood expert for family homes, infill opportunities, and investor-ready land.",
    active: true
  }
];

const seedProperties = [
  {
    id: "00000000-0000-4000-8000-000000000301",
    propertyType: "villa" as const,
    addressLine1: "100 Hillcrest Court",
    city: "Austin",
    neighborhood: "Hillcrest",
    region: "TX",
    country: "US",
    beds: 5,
    baths: 4,
    areaSqft: 4210,
    lotSqft: 9200
  },
  {
    id: "00000000-0000-4000-8000-000000000302",
    propertyType: "penthouse" as const,
    addressLine1: "88 Arts District Avenue",
    city: "Miami",
    neighborhood: "Arts District",
    region: "FL",
    country: "US",
    beds: 4,
    baths: 4,
    areaSqft: 3180,
    lotSqft: null
  },
  {
    id: "00000000-0000-4000-8000-000000000303",
    propertyType: "house" as const,
    addressLine1: "42 Willow Park Lane",
    city: "Denver",
    neighborhood: "Willow Park",
    region: "CO",
    country: "US",
    beds: 4,
    baths: 3,
    areaSqft: 2680,
    lotSqft: 6100
  },
  {
    id: "00000000-0000-4000-8000-000000000304",
    propertyType: "townhouse" as const,
    addressLine1: "12 North Bay Terrace",
    city: "San Diego",
    neighborhood: "North Bay",
    region: "CA",
    country: "US",
    beds: 3,
    baths: 3,
    areaSqft: 1880,
    lotSqft: null
  },
  {
    id: "00000000-0000-4000-8000-000000000305",
    propertyType: "apartment" as const,
    addressLine1: "210 Old Town Row",
    city: "Chicago",
    neighborhood: "Old Town",
    region: "IL",
    country: "US",
    beds: 2,
    baths: 2,
    areaSqft: 1160,
    lotSqft: null
  },
  {
    id: "00000000-0000-4000-8000-000000000306",
    propertyType: "land" as const,
    addressLine1: "7 Lakeview Parcel Road",
    city: "Nashville",
    neighborhood: "Lakeview",
    region: "TN",
    country: "US",
    beds: 0,
    baths: 0,
    areaSqft: 14400,
    lotSqft: null
  }
];

const seedListings = [
  {
    id: "00000000-0000-4000-8000-000000000401",
    propertyId: seedProperties[0].id,
    agentId: seedAgents[0].id,
    slug: "hillcrest-modern-villa",
    title: "Hillcrest modern villa with private courtyard",
    listingType: "sale" as const,
    status: "published" as const,
    price: 1285000,
    currency: "USD",
    summary:
      "A calm modern villa designed for indoor-outdoor living, with bright social spaces, a private courtyard, and a flexible guest suite.",
    tags: ["New", "Pool", "Private tour"],
    highlights: ["Private courtyard", "Chef-ready kitchen", "Two-car garage", "Minutes from dining"],
    publishedAt: new Date("2026-01-01T00:00:00.000Z")
  },
  {
    id: "00000000-0000-4000-8000-000000000402",
    propertyId: seedProperties[1].id,
    agentId: seedAgents[1].id,
    slug: "downtown-skyline-penthouse",
    title: "Downtown skyline penthouse near the arts district",
    listingType: "sale" as const,
    status: "published" as const,
    price: 2140000,
    currency: "USD",
    summary:
      "A high-floor residence with wide skyline views, gallery walls, generous entertaining space, and private elevator access.",
    tags: ["Penthouse", "Views", "Concierge"],
    highlights: ["Private elevator", "City views", "Concierge building", "Walkable location"],
    publishedAt: new Date("2026-01-02T00:00:00.000Z")
  },
  {
    id: "00000000-0000-4000-8000-000000000403",
    propertyId: seedProperties[2].id,
    agentId: seedAgents[2].id,
    slug: "willow-park-family-home",
    title: "Willow Park family home with flexible studio",
    listingType: "sale" as const,
    status: "published" as const,
    price: 735000,
    currency: "USD",
    summary:
      "A practical, warm home with a studio that works for guests, remote work, or a future rental strategy.",
    tags: ["Family", "Studio", "Price aligned"],
    highlights: ["Flexible studio", "Renovated baths", "Quiet street", "Close to parks"],
    publishedAt: new Date("2026-01-03T00:00:00.000Z")
  },
  {
    id: "00000000-0000-4000-8000-000000000404",
    propertyId: seedProperties[3].id,
    agentId: seedAgents[0].id,
    slug: "north-bay-rental-retreat",
    title: "North Bay rental retreat with garden terrace",
    listingType: "rent" as const,
    status: "published" as const,
    price: 4800,
    currency: "USD",
    summary:
      "A low-maintenance rental with generous light, a private outdoor terrace, and quick access to the coastline.",
    tags: ["Rental", "Terrace", "Available now"],
    highlights: ["Available this month", "Private terrace", "Pet-friendly review", "Two parking spaces"],
    publishedAt: new Date("2026-01-04T00:00:00.000Z")
  },
  {
    id: "00000000-0000-4000-8000-000000000405",
    propertyId: seedProperties[4].id,
    agentId: seedAgents[1].id,
    slug: "old-town-apartment",
    title: "Old Town apartment with restored details",
    listingType: "rent" as const,
    status: "published" as const,
    price: 2950,
    currency: "USD",
    summary:
      "A polished apartment in a walkable neighborhood with restored character, tall windows, and practical storage.",
    tags: ["Apartment", "Walkable", "Bright"],
    highlights: ["Walkable block", "Restored details", "Tall windows", "In-unit laundry"],
    publishedAt: new Date("2026-01-05T00:00:00.000Z")
  },
  {
    id: "00000000-0000-4000-8000-000000000406",
    propertyId: seedProperties[5].id,
    agentId: seedAgents[2].id,
    slug: "lakeview-build-ready-land",
    title: "Lakeview build-ready land with approved concept",
    listingType: "sale" as const,
    status: "published" as const,
    price: 420000,
    currency: "USD",
    summary:
      "A build-ready parcel with approved concept materials and strong access to the lake corridor.",
    tags: ["Land", "Build-ready", "Investor"],
    highlights: ["Approved concept", "Utility access", "Investor-ready", "Lake corridor"],
    publishedAt: new Date("2026-01-06T00:00:00.000Z")
  }
];

const seedMedia = seedListings.map((listing, index) => ({
  id: `00000000-0000-4000-8000-00000000050${index + 1}`,
  listingId: listing.id,
  url: "",
  alt: listing.title,
  sortOrder: 0
}));

try {
  await db.insert(userProfiles).values(agentProfiles).onConflictDoNothing();
  await db.insert(agents).values(seedAgents).onConflictDoNothing();
  await db.insert(properties).values(seedProperties).onConflictDoNothing();
  await db.insert(listings).values(seedListings).onConflictDoNothing();
  await db.insert(propertyMedia).values(seedMedia).onConflictDoNothing();
  console.log("Seeded 6 listings.");
  process.exit(0);
} catch (error) {
  console.error("Seed failed:", error);
  process.exit(1);
}
