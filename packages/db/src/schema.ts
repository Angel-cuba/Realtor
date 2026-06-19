import {
  boolean,
  integer,
  json,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid
} from "drizzle-orm/pg-core";
import { leadIntents, leadStatuses, listingStatuses, listingTypes, propertyTypes } from "@realtor/domain";

export const listingTypeEnum = pgEnum("listing_type", listingTypes);
export const propertyTypeEnum = pgEnum("property_type", propertyTypes);
export const listingStatusEnum = pgEnum("listing_status", listingStatuses);
export const leadStatusEnum = pgEnum("lead_status", leadStatuses);
export const leadIntentEnum = pgEnum("lead_intent", leadIntents);

export const userProfiles = pgTable("user_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkUserId: text("clerk_user_id").notNull().unique(),
  displayName: text("display_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});

export const agents = pgTable("agents", {
  id: uuid("id").primaryKey().defaultRandom(),
  userProfileId: uuid("user_profile_id").references(() => userProfiles.id),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  licenseNumber: text("license_number"),
  bio: text("bio"),
  active: boolean("active").notNull().default(true)
});

export const properties = pgTable("properties", {
  id: uuid("id").primaryKey().defaultRandom(),
  propertyType: propertyTypeEnum("property_type").notNull(),
  addressLine1: text("address_line_1").notNull(),
  addressLine2: text("address_line_2"),
  city: text("city").notNull(),
  neighborhood: text("neighborhood").notNull(),
  region: text("region"),
  postalCode: text("postal_code"),
  country: text("country").notNull(),
  latitude: numeric("latitude", { precision: 10, scale: 7 }),
  longitude: numeric("longitude", { precision: 10, scale: 7 }),
  beds: integer("beds").notNull().default(0),
  baths: integer("baths").notNull().default(0),
  areaSqft: integer("area_sqft").notNull(),
  lotSqft: integer("lot_sqft"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});

export const listings = pgTable("listings", {
  id: uuid("id").primaryKey().defaultRandom(),
  propertyId: uuid("property_id").notNull().references(() => properties.id),
  agentId: uuid("agent_id").references(() => agents.id),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  listingType: listingTypeEnum("listing_type").notNull(),
  status: listingStatusEnum("status").notNull().default("draft"),
  price: integer("price").notNull(),
  currency: text("currency").notNull().default("USD"),
  summary: text("summary").notNull(),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  tags: json("tags").$type<string[]>().notNull(),
  highlights: json("highlights").$type<string[]>().notNull()
});

export const propertyMedia = pgTable("property_media", {
  id: uuid("id").primaryKey().defaultRandom(),
  listingId: uuid("listing_id").notNull().references(() => listings.id),
  url: text("url").notNull(),
  alt: text("alt").notNull(),
  sortOrder: integer("sort_order").notNull().default(0)
});

export const leads = pgTable("leads", {
  id: uuid("id").primaryKey().defaultRandom(),
  listingId: uuid("listing_id").references(() => listings.id),
  assignedAgentId: uuid("assigned_agent_id").references(() => agents.id),
  intent: leadIntentEnum("intent").notNull(),
  status: leadStatusEnum("status").notNull().default("new"),
  score: integer("score").notNull().default(0),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});
