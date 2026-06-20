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

export const leadStatusLabels: Record<LeadStatus, string> = {
  new: "Nuevo",
  contacted: "Contactado",
  qualified: "Calificado",
  tour_scheduled: "Tour agendado",
  offer_intent: "Intencion de oferta",
  negotiating: "Negociando",
  won: "Ganado",
  lost: "Perdido"
};

export function leadStatusLabel(status: string) {
  return leadStatusLabels[status as LeadStatus] ?? status;
}

export const leadNoteInputSchema = z.object({
  body: z.string().min(2).max(2000)
});

export type LeadNoteInput = z.infer<typeof leadNoteInputSchema>;

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

export const leadIntentLabels: Record<LeadIntent, string> = {
  buy: "Compra",
  rent: "Renta",
  sell: "Venta",
  lease_out: "Alquilar propiedad",
  general: "General"
};

export function leadIntentLabel(intent: string) {
  return leadIntentLabels[intent as LeadIntent] ?? intent;
}

export const leadInputSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().min(6).max(40).optional().or(z.literal("")),
  intent: leadIntentSchema,
  listingSlug: z.string().min(2).max(160).optional(),
  message: z.string().min(10).max(1200)
});

export type LeadInput = z.infer<typeof leadInputSchema>;

export const listingStatusLabels: Record<ListingStatus, string> = {
  draft: "Borrador",
  pending_review: "En revision",
  published: "Publicada",
  reserved: "Reservada",
  under_contract: "En contrato",
  sold: "Vendida",
  rented: "Rentada",
  archived: "Archivada"
};

export const listingInputSchema = z.object({
  title: z.string().min(4).max(160),
  listingType: z.enum(listingTypes),
  propertyType: z.enum(propertyTypes),
  price: z.number().int().positive().max(2_000_000_000),
  currency: z.enum(["USD", "EUR"]),
  summary: z.string().min(10).max(2000),
  tags: z.array(z.string().min(1).max(40)).max(12).default([]),
  highlights: z.array(z.string().min(1).max(120)).max(12).default([]),
  addressLine1: z.string().min(3).max(200),
  addressLine2: z.string().max(200).optional().or(z.literal("")),
  city: z.string().min(2).max(120),
  neighborhood: z.string().min(2).max(120),
  region: z.string().max(120).optional().or(z.literal("")),
  postalCode: z.string().max(20).optional().or(z.literal("")),
  country: z.string().min(2).max(80),
  beds: z.number().int().min(0).max(50),
  baths: z.number().int().min(0).max(50),
  areaSqft: z.number().int().positive().max(1_000_000),
  lotSqft: z.number().int().positive().max(10_000_000).optional()
});

export type ListingInput = z.infer<typeof listingInputSchema>;

export const listingStatusUpdateSchema = z.object({
  status: z.enum(listingStatuses)
});

export function listingStatusLabel(status: string) {
  return listingStatusLabels[status as ListingStatus] ?? status;
}

export type PropertyListing = {
  id: string;
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
  const locale = currency === "EUR" ? "es-ES" : "en-US";
  return new Intl.NumberFormat(locale, {
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
