import { existsSync } from "node:fs";

if (existsSync("apps/web/.env.local")) {
  process.loadEnvFile("apps/web/.env.local");
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set. Add it to apps/web/.env.local");
}

const { db, listings, properties } = await import("./index");

const AGENT_MAYA = "00000000-0000-4000-8000-000000000201";
const AGENT_NOAH = "00000000-0000-4000-8000-000000000202";
const AGENT_LENA = "00000000-0000-4000-8000-000000000203";

function id(n: string) {
  return `00000000-0000-4000-8000-000000000${n}`;
}

function daysAgo(n: number) {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000);
}

type ExtraProperty = typeof properties.$inferInsert;
type ExtraListing = typeof listings.$inferInsert;

const extraProperties: ExtraProperty[] = [
  // Miami (5)
  { id: id("701"), propertyType: "apartment", addressLine1: "900 Brickell Ave", city: "Miami", neighborhood: "Brickell", region: "FL", country: "US", beds: 2, baths: 2, areaSqft: 1320 },
  { id: id("702"), propertyType: "penthouse", addressLine1: "1200 Biscayne Blvd", city: "Miami", neighborhood: "Wynwood", region: "FL", country: "US", beds: 4, baths: 4, areaSqft: 3180 },
  { id: id("703"), propertyType: "apartment", addressLine1: "450 Brickell Key Dr", city: "Miami", neighborhood: "Brickell", region: "FL", country: "US", beds: 1, baths: 1, areaSqft: 860 },
  { id: id("704"), propertyType: "villa", addressLine1: "3500 Main Hwy", city: "Miami", neighborhood: "Coconut Grove", region: "FL", country: "US", beds: 5, baths: 5, areaSqft: 4720, lotSqft: 11200 },
  { id: id("705"), propertyType: "townhouse", addressLine1: "2200 NW 2nd Ave", city: "Miami", neighborhood: "Wynwood", region: "FL", country: "US", beds: 3, baths: 3, areaSqft: 1980, lotSqft: 2400 },
  // Ciudad de Mexico (5)
  { id: id("706"), propertyType: "apartment", addressLine1: "Av Presidente Masaryk 200", city: "Ciudad de Mexico", neighborhood: "Polanco", region: "CDMX", country: "MX", beds: 3, baths: 3, areaSqft: 2150 },
  { id: id("707"), propertyType: "apartment", addressLine1: "Calle Orizaba 80", city: "Ciudad de Mexico", neighborhood: "Roma Norte", region: "CDMX", country: "MX", beds: 2, baths: 2, areaSqft: 1180 },
  { id: id("708"), propertyType: "penthouse", addressLine1: "Av Tamaulipas 90", city: "Ciudad de Mexico", neighborhood: "Condesa", region: "CDMX", country: "MX", beds: 3, baths: 3, areaSqft: 2400 },
  { id: id("709"), propertyType: "apartment", addressLine1: "Calle Amsterdam 150", city: "Ciudad de Mexico", neighborhood: "Condesa", region: "CDMX", country: "MX", beds: 1, baths: 1, areaSqft: 720 },
  { id: id("710"), propertyType: "house", addressLine1: "Calle Sierra Madre 45", city: "Ciudad de Mexico", neighborhood: "Polanco", region: "CDMX", country: "MX", beds: 4, baths: 4, areaSqft: 3650, lotSqft: 4800 },
  // Madrid (5)
  { id: id("711"), propertyType: "apartment", addressLine1: "Calle Serrano 110", city: "Madrid", neighborhood: "Salamanca", region: "Madrid", country: "ES", beds: 3, baths: 2, areaSqft: 1610 },
  { id: id("712"), propertyType: "apartment", addressLine1: "Calle del Pez 18", city: "Madrid", neighborhood: "Malasana", region: "Madrid", country: "ES", beds: 2, baths: 1, areaSqft: 970 },
  { id: id("713"), propertyType: "penthouse", addressLine1: "Calle Almagro 22", city: "Madrid", neighborhood: "Chamberi", region: "Madrid", country: "ES", beds: 3, baths: 3, areaSqft: 2050 },
  { id: id("714"), propertyType: "apartment", addressLine1: "Calle Velazquez 90", city: "Madrid", neighborhood: "Salamanca", region: "Madrid", country: "ES", beds: 4, baths: 3, areaSqft: 2380 },
  { id: id("715"), propertyType: "apartment", addressLine1: "Calle Fuencarral 70", city: "Madrid", neighborhood: "Malasana", region: "Madrid", country: "ES", beds: 1, baths: 1, areaSqft: 640 },
  // Buenos Aires (4)
  { id: id("716"), propertyType: "apartment", addressLine1: "Av Santa Fe 3200", city: "Buenos Aires", neighborhood: "Palermo", region: "CABA", country: "AR", beds: 2, baths: 2, areaSqft: 1180 },
  { id: id("717"), propertyType: "apartment", addressLine1: "Av Alvear 1500", city: "Buenos Aires", neighborhood: "Recoleta", region: "CABA", country: "AR", beds: 3, baths: 3, areaSqft: 1950 },
  { id: id("718"), propertyType: "penthouse", addressLine1: "Av Libertador 4400", city: "Buenos Aires", neighborhood: "Palermo", region: "CABA", country: "AR", beds: 4, baths: 3, areaSqft: 2680 },
  { id: id("719"), propertyType: "apartment", addressLine1: "Calle Arenales 1800", city: "Buenos Aires", neighborhood: "Recoleta", region: "CABA", country: "AR", beds: 1, baths: 1, areaSqft: 720 },
  // Bogota (3)
  { id: id("720"), propertyType: "apartment", addressLine1: "Carrera 11 #93", city: "Bogota", neighborhood: "Chapinero", region: "Cundinamarca", country: "CO", beds: 2, baths: 2, areaSqft: 1240 },
  { id: id("721"), propertyType: "house", addressLine1: "Calle 119 #6", city: "Bogota", neighborhood: "Usaquen", region: "Cundinamarca", country: "CO", beds: 4, baths: 4, areaSqft: 3120, lotSqft: 4400 },
  { id: id("722"), propertyType: "apartment", addressLine1: "Carrera 7 #70", city: "Bogota", neighborhood: "Chapinero", region: "Cundinamarca", country: "CO", beds: 1, baths: 1, areaSqft: 680 },
  // Medellin (3)
  { id: id("723"), propertyType: "apartment", addressLine1: "Carrera 35 #8A", city: "Medellin", neighborhood: "El Poblado", region: "Antioquia", country: "CO", beds: 3, baths: 2, areaSqft: 1480 },
  { id: id("724"), propertyType: "house", addressLine1: "Calle 35 #65", city: "Medellin", neighborhood: "Laureles", region: "Antioquia", country: "CO", beds: 4, baths: 3, areaSqft: 2780, lotSqft: 3800 },
  { id: id("725"), propertyType: "apartment", addressLine1: "Carrera 43F #11", city: "Medellin", neighborhood: "El Poblado", region: "Antioquia", country: "CO", beds: 2, baths: 2, areaSqft: 1090 },
  // Barcelona (3)
  { id: id("726"), propertyType: "apartment", addressLine1: "Passeig de Gracia 80", city: "Barcelona", neighborhood: "Eixample", region: "Catalonia", country: "ES", beds: 3, baths: 2, areaSqft: 1690 },
  { id: id("727"), propertyType: "apartment", addressLine1: "Carrer de Verdi 60", city: "Barcelona", neighborhood: "Gracia", region: "Catalonia", country: "ES", beds: 2, baths: 1, areaSqft: 920 },
  { id: id("728"), propertyType: "penthouse", addressLine1: "Avinguda Diagonal 410", city: "Barcelona", neighborhood: "Eixample", region: "Catalonia", country: "ES", beds: 4, baths: 3, areaSqft: 2310 },
  // San Juan (2)
  { id: id("729"), propertyType: "apartment", addressLine1: "1130 Ashford Ave", city: "San Juan", neighborhood: "Condado", region: "PR", country: "PR", beds: 2, baths: 2, areaSqft: 1320 },
  { id: id("730"), propertyType: "townhouse", addressLine1: "256 Calle del Cristo", city: "San Juan", neighborhood: "Old San Juan", region: "PR", country: "PR", beds: 3, baths: 3, areaSqft: 1880, lotSqft: 2100 },
];

const extraListings: ExtraListing[] = [
  { id: id("801"), propertyId: id("701"), agentId: AGENT_NOAH, slug: "brickell-skyline-condo", title: "Brickell skyline condo with bay views", listingType: "sale", status: "published", price: 685000, currency: "USD", summary: "High-floor condo on Brickell Avenue with full bay-and-skyline exposure, modern finishes, and concierge building amenities.", tags: ["Bay view", "Pool", "Doorman"], highlights: ["Floor-to-ceiling windows", "Italian kitchen", "Walk to restaurants"], publishedAt: daysAgo(12) },
  { id: id("802"), propertyId: id("702"), agentId: AGENT_NOAH, slug: "wynwood-arts-penthouse", title: "Downtown skyline penthouse near the arts district", listingType: "sale", status: "published", price: 2140000, currency: "USD", summary: "A high-floor residence with wide skyline views, gallery walls, generous entertaining space, and private elevator access.", tags: ["Penthouse", "Skyline view", "Private elevator"], highlights: ["Wraparound terrace", "Chef kitchen", "Two-car garage"], publishedAt: daysAgo(5) },
  { id: id("803"), propertyId: id("703"), agentId: AGENT_NOAH, slug: "brickell-key-rental-studio", title: "Brickell Key one-bedroom with marina views", listingType: "rent", status: "published", price: 3200, currency: "USD", summary: "Compact and bright one-bedroom on Brickell Key, walking distance to downtown, with marina sunsets every evening.", tags: ["Marina", "Furnished", "Available now"], highlights: ["Hardwood floors", "In-unit laundry", "Walkable"], publishedAt: daysAgo(2) },
  { id: id("804"), propertyId: id("704"), agentId: AGENT_MAYA, slug: "coconut-grove-villa", title: "Coconut Grove villa with tropical courtyard", listingType: "sale", status: "published", price: 3950000, currency: "USD", summary: "Architectural villa tucked into mature trees with a private courtyard, pool, guest suite, and chef-grade kitchen.", tags: ["Villa", "Pool", "Lush gardens"], highlights: ["Guest suite", "Outdoor kitchen", "Private gate"], publishedAt: daysAgo(18) },
  { id: id("805"), propertyId: id("705"), agentId: AGENT_MAYA, slug: "wynwood-townhouse-rental", title: "Wynwood townhouse minutes from the murals", listingType: "rent", status: "published", price: 5800, currency: "USD", summary: "Three-level townhouse in the heart of Wynwood with rooftop terrace and dedicated office space.", tags: ["Rooftop", "Office", "Walkable"], highlights: ["Two-car garage", "Rooftop deck", "Walk to galleries"], publishedAt: daysAgo(7) },
  { id: id("806"), propertyId: id("706"), agentId: AGENT_LENA, slug: "polanco-masaryk-condo", title: "Polanco apartment steps from Masaryk", listingType: "sale", status: "published", price: 14500000, currency: "USD", summary: "Refined three-bedroom on Avenida Masaryk with high-end finishes, private parking, and 24/7 concierge.", tags: ["Concierge", "Parking", "Boutique building"], highlights: ["Marble kitchen", "Master suite", "Boutique gym"], publishedAt: daysAgo(20) },
  { id: id("807"), propertyId: id("707"), agentId: AGENT_LENA, slug: "roma-norte-design-loft", title: "Roma Norte design loft with terrace", listingType: "sale", status: "published", price: 7200000, currency: "USD", summary: "Open-plan loft in a remodeled building on Orizaba with a private terrace and rooftop garden access.", tags: ["Loft", "Terrace", "Rooftop garden"], highlights: ["Concrete floors", "Private terrace", "Walk to cafes"], publishedAt: daysAgo(11) },
  { id: id("808"), propertyId: id("708"), agentId: AGENT_LENA, slug: "condesa-tamaulipas-penthouse", title: "Condesa penthouse over Parque Mexico", listingType: "sale", status: "published", price: 11200000, currency: "USD", summary: "Penthouse with double-height living, panoramic park views, and a wraparound terrace ideal for entertaining.", tags: ["Penthouse", "Park view", "Double height"], highlights: ["Wraparound terrace", "Park views", "Private elevator"], publishedAt: daysAgo(6) },
  { id: id("809"), propertyId: id("709"), agentId: AGENT_LENA, slug: "condesa-amsterdam-rental", title: "Condesa Amsterdam one-bedroom", listingType: "rent", status: "published", price: 28000, currency: "USD", summary: "Bright one-bedroom on the iconic Calle Amsterdam loop, blocks from Parque Mexico and Avenida Tamaulipas.", tags: ["Furnished", "Walkable", "Available now"], highlights: ["Wood floors", "Quiet building", "Open kitchen"], publishedAt: daysAgo(3) },
  { id: id("810"), propertyId: id("710"), agentId: AGENT_LENA, slug: "polanco-family-house-rental", title: "Polanco family house with garden", listingType: "rent", status: "published", price: 95000, currency: "USD", summary: "Spacious family home in residential Polanco with a private garden, four bedrooms, and a service area.", tags: ["Garden", "Family", "Private parking"], highlights: ["Private garden", "Two-car garage", "Service quarters"], publishedAt: daysAgo(14) },
  { id: id("811"), propertyId: id("711"), agentId: AGENT_MAYA, slug: "salamanca-serrano-apartment", title: "Salamanca apartment on Calle Serrano", listingType: "sale", status: "published", price: 1290000, currency: "EUR", summary: "Classic Salamanca apartment with original mouldings, restored hardwood floors, and a south-facing balcony.", tags: ["Classic", "Balcony", "Restored"], highlights: ["Original mouldings", "Hardwood floors", "South-facing balcony"], publishedAt: daysAgo(22) },
  { id: id("812"), propertyId: id("712"), agentId: AGENT_MAYA, slug: "malasana-loft-rental", title: "Malasana loft minutes from Plaza del Dos de Mayo", listingType: "rent", status: "published", price: 1850, currency: "EUR", summary: "Renovated loft in the heart of Malasana, walking distance to bars, restaurants, and Gran Via.", tags: ["Renovated", "Walkable", "Furnished"], highlights: ["Exposed brick", "Open kitchen", "Quiet building"], publishedAt: daysAgo(4) },
  { id: id("813"), propertyId: id("713"), agentId: AGENT_MAYA, slug: "chamberi-almagro-penthouse", title: "Chamberi penthouse with private terrace", listingType: "sale", status: "published", price: 1780000, currency: "EUR", summary: "Penthouse with private terrace overlooking Chamberi rooftops, fully renovated with high ceilings.", tags: ["Penthouse", "Terrace", "Renovated"], highlights: ["Private terrace", "High ceilings", "South orientation"], publishedAt: daysAgo(9) },
  { id: id("814"), propertyId: id("714"), agentId: AGENT_MAYA, slug: "salamanca-velazquez-family", title: "Salamanca family apartment on Velazquez", listingType: "sale", status: "published", price: 2450000, currency: "EUR", summary: "Large four-bedroom apartment in the heart of the Golden Mile, ideal for families seeking space and location.", tags: ["Family", "Doorman", "Golden Mile"], highlights: ["Four bedrooms", "Service entrance", "Doorman"], publishedAt: daysAgo(15) },
  { id: id("815"), propertyId: id("715"), agentId: AGENT_MAYA, slug: "malasana-fuencarral-studio", title: "Malasana studio on Calle Fuencarral", listingType: "rent", status: "published", price: 1200, currency: "EUR", summary: "Compact furnished studio on Fuencarral, perfect for digital nomads who want to live in the city center.", tags: ["Studio", "Furnished", "City center"], highlights: ["Furnished", "High floor", "Walk everywhere"], publishedAt: daysAgo(1) },
  { id: id("816"), propertyId: id("716"), agentId: AGENT_NOAH, slug: "palermo-santa-fe-apartment", title: "Palermo apartment on Avenida Santa Fe", listingType: "sale", status: "published", price: 285000, currency: "USD", summary: "Renovated two-bedroom on Avenida Santa Fe with a wide balcony and natural light all day.", tags: ["Renovated", "Balcony", "Natural light"], highlights: ["Wide balcony", "Open kitchen", "Bright"], publishedAt: daysAgo(13) },
  { id: id("817"), propertyId: id("717"), agentId: AGENT_NOAH, slug: "recoleta-alvear-classic", title: "Recoleta classic on Avenida Alvear", listingType: "sale", status: "published", price: 690000, currency: "USD", summary: "Pre-war classic apartment with high ceilings and parquet floors, steps from Plaza Francia.", tags: ["Classic", "Pre-war", "Parquet"], highlights: ["High ceilings", "Parquet floors", "Service quarters"], publishedAt: daysAgo(17) },
  { id: id("818"), propertyId: id("718"), agentId: AGENT_NOAH, slug: "palermo-libertador-penthouse", title: "Palermo penthouse on Avenida Libertador", listingType: "rent", status: "published", price: 2400, currency: "USD", summary: "Penthouse with terrace and grill, river views, and access to a building pool and gym.", tags: ["Penthouse", "Pool", "River view"], highlights: ["Terrace and grill", "Building pool", "Building gym"], publishedAt: daysAgo(8) },
  { id: id("819"), propertyId: id("719"), agentId: AGENT_NOAH, slug: "recoleta-arenales-studio", title: "Recoleta studio on Calle Arenales", listingType: "rent", status: "published", price: 780, currency: "USD", summary: "Furnished studio steps from Recoleta cemetery and the cafes of Plaza Francia.", tags: ["Studio", "Furnished", "Walkable"], highlights: ["Furnished", "Quiet street", "Walk to cafes"], publishedAt: daysAgo(2) },
  { id: id("820"), propertyId: id("720"), agentId: AGENT_LENA, slug: "chapinero-93-condo", title: "Chapinero condo near Parque 93", listingType: "sale", status: "published", price: 320000, currency: "USD", summary: "Two-bedroom condo on Carrera 11 with park views and restaurants at the doorstep.", tags: ["Park view", "Walkable", "Restaurants"], highlights: ["Park view", "Walk to restaurants", "Bright"], publishedAt: daysAgo(10) },
  { id: id("821"), propertyId: id("721"), agentId: AGENT_LENA, slug: "usaquen-family-house", title: "Usaquen family house with garden", listingType: "sale", status: "published", price: 720000, currency: "USD", summary: "Four-bedroom family house in residential Usaquen with garden and weekend market across the street.", tags: ["Family", "Garden", "Market"], highlights: ["Private garden", "Family room", "Weekend market"], publishedAt: daysAgo(16) },
  { id: id("822"), propertyId: id("722"), agentId: AGENT_LENA, slug: "chapinero-zona-g-rental", title: "Chapinero studio in Zona G", listingType: "rent", status: "published", price: 950, currency: "USD", summary: "Furnished studio in Zona G, surrounded by cafes and restaurants, ideal for short stays.", tags: ["Studio", "Furnished", "Cafes"], highlights: ["Furnished", "Wifi included", "Walk to cafes"], publishedAt: daysAgo(5) },
  { id: id("823"), propertyId: id("723"), agentId: AGENT_LENA, slug: "poblado-condo-mountain-view", title: "El Poblado condo with mountain views", listingType: "sale", status: "published", price: 245000, currency: "USD", summary: "Three-bedroom condo in El Poblado with terrace and mountain views, walking distance to Lleras.", tags: ["Mountain view", "Terrace", "Walkable"], highlights: ["Private terrace", "Mountain view", "Concierge"], publishedAt: daysAgo(7) },
  { id: id("824"), propertyId: id("724"), agentId: AGENT_LENA, slug: "laureles-family-home", title: "Laureles family home on Estadio", listingType: "sale", status: "published", price: 410000, currency: "USD", summary: "Four-bedroom family home in Laureles with patio, service quarters, and quiet residential street.", tags: ["Family", "Patio", "Quiet street"], highlights: ["Patio", "Service quarters", "Two-car garage"], publishedAt: daysAgo(12) },
  { id: id("825"), propertyId: id("725"), agentId: AGENT_LENA, slug: "poblado-rental-furnished", title: "El Poblado furnished apartment for rent", listingType: "rent", status: "published", price: 1450, currency: "USD", summary: "Furnished two-bedroom apartment in El Poblado, walking distance to Provenza and restaurants.", tags: ["Furnished", "Walkable", "Pool"], highlights: ["Furnished", "Building pool", "Walk to Provenza"], publishedAt: daysAgo(3) },
  { id: id("826"), propertyId: id("726"), agentId: AGENT_MAYA, slug: "eixample-gracia-classic", title: "Eixample apartment on Passeig de Gracia", listingType: "sale", status: "published", price: 1450000, currency: "EUR", summary: "Classic Eixample apartment with high ceilings, restored mosaic tiles, and a sunny gallery.", tags: ["Modernista", "Restored", "Gallery"], highlights: ["High ceilings", "Mosaic tiles", "Sunny gallery"], publishedAt: daysAgo(19) },
  { id: id("827"), propertyId: id("727"), agentId: AGENT_MAYA, slug: "gracia-verdi-rental", title: "Gracia apartment on Carrer de Verdi", listingType: "rent", status: "published", price: 1750, currency: "EUR", summary: "Two-bedroom on Verdi in the village vibe of Gracia, steps from squares and indie cafes.", tags: ["Village", "Walkable", "Cafes"], highlights: ["Village vibe", "Walk to squares", "Bright"], publishedAt: daysAgo(4) },
  { id: id("828"), propertyId: id("728"), agentId: AGENT_MAYA, slug: "eixample-diagonal-penthouse", title: "Eixample penthouse on Avinguda Diagonal", listingType: "sale", status: "published", price: 2350000, currency: "EUR", summary: "Penthouse on Diagonal with private terrace and city views, fully renovated with smart-home wiring.", tags: ["Penthouse", "Smart home", "Terrace"], highlights: ["Private terrace", "Smart home", "Renovated"], publishedAt: daysAgo(21) },
  { id: id("829"), propertyId: id("729"), agentId: AGENT_NOAH, slug: "condado-ashford-apartment", title: "Condado apartment on Ashford Avenue", listingType: "sale", status: "published", price: 580000, currency: "USD", summary: "Two-bedroom condo across from the beach with ocean breeze, building pool, and concierge.", tags: ["Beach", "Pool", "Concierge"], highlights: ["Ocean view", "Building pool", "Concierge"], publishedAt: daysAgo(9) },
  { id: id("830"), propertyId: id("730"), agentId: AGENT_NOAH, slug: "old-san-juan-townhouse", title: "Old San Juan townhouse in the historic core", listingType: "rent", status: "published", price: 2900, currency: "USD", summary: "Restored townhouse on Calle del Cristo with patio, rooftop, and views over the old city.", tags: ["Historic", "Rooftop", "Patio"], highlights: ["Historic facade", "Rooftop", "Restored interiors"], publishedAt: daysAgo(6) },
];

try {
  await db.insert(properties).values(extraProperties).onConflictDoNothing();
  await db.insert(listings).values(extraListings).onConflictDoNothing();
  console.log(`Seeded ${extraListings.length} demo listings across 8 cities.`);
  process.exit(0);
} catch (error) {
  console.error("Extra seed failed:", error);
  process.exit(1);
}
