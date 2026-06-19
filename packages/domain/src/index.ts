import { z } from "zod";

export const leadStatuses = [
  "new",
  "contacted",
  "qualified",
  "tour_scheduled",
  "offer_intent",
  "negotiating",
  "won",
  "lost"
] as const;
export type LeadStatus = (typeof leadStatuses)[number];

export const leadStatusUpdateSchema = z.object({
  status: z.enum(leadStatuses)
});

export const listingTypes = ["sale", "rent"] as const;
export const propertyTypes = ["house", "apartment", "villa", "townhouse", "land", "penthouse"] as const;
export const listingStatuses = [
  "draft",
  "pending_review",
  "published",
  "reserved",
  "under_contract",
  "sold",
  "rented",
  "archived"
] as const;
export const userRoles = ["buyer", "owner", "agent", "manager", "admin"] as const;

export type ListingType = (typeof listingTypes)[number];
export type PropertyType = (typeof propertyTypes)[number];
export type ListingStatus = (typeof listingStatuses)[number];
export type UserRole = (typeof userRoles)[number];

export const leadIntents = ["buy", "rent", "sell", "lease_out", "general"] as const;
export type LeadIntent = (typeof leadIntents)[number];
export const leadIntentSchema = z.enum(leadIntents);

export const leadInputSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().min(6).max(40).optional().or(z.literal("")),
  intent: leadIntentSchema,
  listingSlug: z.string().min(2).max(160).optional(),
  message: z.string().min(10).max(1200)
});

export type LeadInput = z.infer<typeof leadInputSchema>;

export type PropertyListing = {
  slug: string;
  title: string;
  listingType: ListingType;
  propertyType: PropertyType;
  status: ListingStatus;
  city: string;
  neighborhood: string;
  addressSummary: string;
  price: number;
  currency: "USD" | "EUR";
  beds: number;
  baths: number;
  areaSqft: number;
  lotSqft?: number;
  image: string;
  gallery: string[];
  tags: string[];
  agentName: string;
  agentTitle: string;
  description: string;
  highlights: string[];
};

export function formatMoney(amount: number, currency: "USD" | "EUR" = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(amount);
}

export function listingTypeLabel(type: ListingType) {
  return type === "sale" ? "For sale" : "For rent";
}

export function propertyTypeLabel(type: PropertyType) {
  const labels: Record<PropertyType, string> = {
    house: "House",
    apartment: "Apartment",
    villa: "Villa",
    townhouse: "Townhouse",
    land: "Land",
    penthouse: "Penthouse"
  };

  return labels[type];
}
