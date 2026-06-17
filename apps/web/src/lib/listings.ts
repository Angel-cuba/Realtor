import type { PropertyListing } from "@realtor/domain";

const imageBase = "/images/realtor";

export const listings: PropertyListing[] = [
  {
    slug: "hillcrest-modern-villa",
    title: "Hillcrest modern villa with private courtyard",
    listingType: "sale",
    propertyType: "villa",
    status: "published",
    city: "Austin",
    neighborhood: "Hillcrest",
    addressSummary: "Hillcrest, Austin",
    price: 1285000,
    currency: "USD",
    beds: 5,
    baths: 4,
    areaSqft: 4210,
    lotSqft: 9200,
    image: `${imageBase}/const-1.webp`,
    gallery: [`${imageBase}/const-1.webp`, `${imageBase}/const-5.webp`, `${imageBase}/const-12.webp`],
    tags: ["New", "Pool", "Private tour"],
    agentName: "Maya Collins",
    agentTitle: "Luxury property advisor",
    description:
      "A calm modern villa designed for indoor-outdoor living, with bright social spaces, a private courtyard, and a flexible guest suite.",
    highlights: ["Private courtyard", "Chef-ready kitchen", "Two-car garage", "Minutes from dining"]
  },
  {
    slug: "downtown-skyline-penthouse",
    title: "Downtown skyline penthouse near the arts district",
    listingType: "sale",
    propertyType: "penthouse",
    status: "published",
    city: "Miami",
    neighborhood: "Arts District",
    addressSummary: "Arts District, Miami",
    price: 2140000,
    currency: "USD",
    beds: 4,
    baths: 4,
    areaSqft: 3180,
    image: `${imageBase}/const-3.webp`,
    gallery: [`${imageBase}/const-3.webp`, `${imageBase}/const-8.webp`, `${imageBase}/const-11.webp`],
    tags: ["Penthouse", "Views", "Concierge"],
    agentName: "Noah Bennett",
    agentTitle: "Senior buyer specialist",
    description:
      "A high-floor residence with wide skyline views, gallery walls, generous entertaining space, and private elevator access.",
    highlights: ["Private elevator", "City views", "Concierge building", "Walkable location"]
  },
  {
    slug: "willow-park-family-home",
    title: "Willow Park family home with flexible studio",
    listingType: "sale",
    propertyType: "house",
    status: "published",
    city: "Denver",
    neighborhood: "Willow Park",
    addressSummary: "Willow Park, Denver",
    price: 735000,
    currency: "USD",
    beds: 4,
    baths: 3,
    areaSqft: 2680,
    lotSqft: 6100,
    image: `${imageBase}/const-5.webp`,
    gallery: [`${imageBase}/const-5.webp`, `${imageBase}/const-6.webp`, `${imageBase}/const-7.webp`],
    tags: ["Family", "Studio", "Price aligned"],
    agentName: "Lena Garcia",
    agentTitle: "Neighborhood specialist",
    description:
      "A practical, warm home with a studio that works for guests, remote work, or a future rental strategy.",
    highlights: ["Flexible studio", "Renovated baths", "Quiet street", "Close to parks"]
  },
  {
    slug: "north-bay-rental-retreat",
    title: "North Bay rental retreat with garden terrace",
    listingType: "rent",
    propertyType: "townhouse",
    status: "published",
    city: "San Diego",
    neighborhood: "North Bay",
    addressSummary: "North Bay, San Diego",
    price: 4800,
    currency: "USD",
    beds: 3,
    baths: 3,
    areaSqft: 1880,
    image: `${imageBase}/const-8.webp`,
    gallery: [`${imageBase}/const-8.webp`, `${imageBase}/const-10.webp`, `${imageBase}/const-12.webp`],
    tags: ["Rental", "Terrace", "Available now"],
    agentName: "Maya Collins",
    agentTitle: "Luxury property advisor",
    description:
      "A low-maintenance rental with generous light, a private outdoor terrace, and quick access to the coastline.",
    highlights: ["Available this month", "Private terrace", "Pet-friendly review", "Two parking spaces"]
  },
  {
    slug: "old-town-apartment",
    title: "Old Town apartment with restored details",
    listingType: "rent",
    propertyType: "apartment",
    status: "published",
    city: "Chicago",
    neighborhood: "Old Town",
    addressSummary: "Old Town, Chicago",
    price: 2950,
    currency: "USD",
    beds: 2,
    baths: 2,
    areaSqft: 1160,
    image: `${imageBase}/const-11.webp`,
    gallery: [`${imageBase}/const-11.webp`, `${imageBase}/const-2.webp`, `${imageBase}/const-4.webp`],
    tags: ["Apartment", "Walkable", "Bright"],
    agentName: "Noah Bennett",
    agentTitle: "Senior buyer specialist",
    description:
      "A polished apartment in a walkable neighborhood with restored character, tall windows, and practical storage.",
    highlights: ["Walkable block", "Restored details", "Tall windows", "In-unit laundry"]
  },
  {
    slug: "lakeview-build-ready-land",
    title: "Lakeview build-ready land with approved concept",
    listingType: "sale",
    propertyType: "land",
    status: "published",
    city: "Nashville",
    neighborhood: "Lakeview",
    addressSummary: "Lakeview, Nashville",
    price: 420000,
    currency: "USD",
    beds: 0,
    baths: 0,
    areaSqft: 14400,
    image: `${imageBase}/const-12.webp`,
    gallery: [`${imageBase}/const-12.webp`, `${imageBase}/const-9.webp`, `${imageBase}/const-6.webp`],
    tags: ["Land", "Build-ready", "Investor"],
    agentName: "Lena Garcia",
    agentTitle: "Neighborhood specialist",
    description:
      "A build-ready parcel with approved concept materials and strong access to the lake corridor.",
    highlights: ["Approved concept", "Utility access", "Investor-ready", "Lake corridor"]
  }
];

export function getListingsByType(type: "sale" | "rent") {
  return listings.filter((listing) => listing.listingType === type);
}

export function getListingBySlug(slug: string) {
  return listings.find((listing) => listing.slug === slug);
}

export function getFeaturedListings() {
  return listings.slice(0, 4);
}
