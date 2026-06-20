# Realtor Platform

Premium real estate platform for Spanish-speaking markets — property listings, lead capture, and agent tooling built as a production-grade monorepo.

## What it does

- **Public site** — listing search and detail pages for buying and renting, filtered by city and budget
- **Lead pipeline** — visitors submit inquiries that land directly in the agent dashboard
- **Agent dashboard** — authenticated view with lead stats, status tracking, and photo upload
- **Media upload** — agents upload property photos from the dashboard; images serve from UploadThing CDN and render on listing cards automatically

## Monorepo layout

```
/
├── apps/
│   ├── web/          — Next.js 16 App Router (primary app)
│   └── mobile/       — Expo Router companion app for listing discovery and lead capture
├── packages/
│   ├── domain/       — Shared TypeScript types, Zod schemas, formatters
│   └── db/           — Drizzle ORM schema, client, seed script
└── drizzle.config.ts — Reads DATABASE_URL from apps/web/.env.local
```

## Tech stack

| Layer | Tech | Version |
|-------|------|---------|
| Framework | Next.js App Router | 16.2.9 |
| Language | TypeScript strict | 6.x |
| Styling | Tailwind CSS | 3.4 |
| Auth | Clerk | 7.5.3 |
| ORM | Drizzle | 0.45.x |
| Database | Supabase (Postgres) | — |
| Media upload | UploadThing | v7 |
| Monorepo | Turborepo + npm workspaces | — |
| Runtime | Node 24.16.0 | (`.nvmrc`) |

**Design tokens:** `bg-ink` (dark), `bg-linen` (warm off-white), `text-gold`/`bg-gold` (accent), `text-moss` (secondary)

## Setup

```bash
# 1. Use the correct Node version
nvm use   # reads .nvmrc → 24.16.0

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example apps/web/.env.local
# Fill in all values — see table below

# 4. Seed the database (idempotent)
npm run db:seed

# 5. Start the dev server
npm run dev:web   # http://localhost:3000
```

## Mobile app

The Expo app in `apps/mobile` is wired to the same public listing and lead APIs
as the web app. It includes:

- Explore screen with sale/rent switching and local city/neighborhood search
- Property detail screen backed by `GET /api/listings/[slug]`
- Session-gated lead submission to `POST /api/leads`
- Floating bottom tab for Comprar, Vender, Rentar, Guardados, and Perfil
- Clerk provider setup with Secure Store token persistence
- Native Clerk sign-in/sign-up screen via `@clerk/expo/native`

```bash
# Start the Next.js API/web app first
npm run dev:web

# In another terminal, start Expo
npm run dev:mobile

# Platform shortcuts
npm run ios --workspace @realtor/mobile
npm run android --workspace @realtor/mobile
```

Mobile environment values live in `apps/mobile/.env`:

| Variable | Purpose |
|----------|---------|
| `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key for the Expo app |
| `EXPO_PUBLIC_API_URL` | Base URL for the web/API app (`http://localhost:3000` on iOS simulator, `http://10.0.2.2:3000` on Android emulator) |

The mobile workspace uses a custom native entrypoint (`apps/mobile/index.native.js`)
that initializes React Native globals before Expo Router. Keep this in place so
Hermes has `FormData`, `URL`, and related globals available before Expo/Clerk
runtime modules load. The app can be browsed signed out, but requesting a visit
or contacting an advisor redirects to mobile sign-in first.

## Environment variables

All variables live in `apps/web/.env.local`. Never commit this file.

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key |
| `CLERK_SECRET_KEY` | Clerk secret key |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Set to `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Set to `/sign-up` |
| `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` | Set to `/dashboard` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL` | Set to `/dashboard` |
| `DATABASE_URL` | Supabase transaction pooler, **port 6543** |
| `UPLOADTHING_TOKEN` | UploadThing project token |
| `RESEND_API_KEY` | Optional — Resend API key for new-lead email notifications |
| `LEADS_NOTIFY_EMAIL` | Optional — recipient address for new-lead notifications |
| `LEADS_NOTIFY_FROM` | Optional — sender (defaults to `onboarding@resend.dev`) |
| `NEXT_PUBLIC_SITE_URL` | Optional — used in email links (defaults to localhost) |

> `DATABASE_URL` must point to the **transaction pooler** (port 6543), not the direct connection (port 5432). Direct connections time out from local machines.

## Database commands

```bash
npm run db:generate     # regenerate Drizzle migration files after schema changes
npm run db:studio       # open Drizzle Studio (visual DB browser)
npm run db:seed         # seed 6 fixture listings with agents and media rows
npm run db:seed-extra   # idempotent: load 30 demo listings across 8 cities
npm run db:seed-images  # idempotent: assign 3 remote home photos per published listing

# Web tests
npm run test --workspace @realtor/web       # Vitest, single run
npm run test:watch --workspace @realtor/web # watch mode
```

## Testing the search (sample cities)

After running `npm run db:seed && npm run db:seed-extra` the database contains
**35 published listings across 13 cities**, so the search on `/comprar` and
`/rentar` always returns results. Use these for QA, demos, and pre-launch
checks:

| City | Neighborhoods | Sale | Rent |
|------|---------------|------|------|
| **Miami** | Brickell · Wynwood · Coconut Grove | 4 | 2 |
| **Madrid** | Salamanca · Malasana · Chamberi | 3 | 2 |
| **Ciudad de Mexico** | Polanco · Roma Norte · Condesa | 3 | 2 |
| **Buenos Aires** | Palermo · Recoleta | 2 | 2 |
| **Bogota** | Chapinero · Usaquen | 2 | 1 |
| **Medellin** | El Poblado · Laureles | 2 | 1 |
| **Barcelona** | Eixample · Gracia | 2 | 1 |
| **San Juan** | Condado · Old San Juan | 1 | 1 |
| Austin · Chicago · Denver · Nashville · San Diego | (from base seed) | 2 | 2 |

Quick smoke test from the home search: type any of `Miami`, `Madrid`, `Polanco`,
`Brickell`, `Palermo`, `El Poblado`, `Eixample`, `Old San Juan` and hit search.
Each query should return at least one card on the matching page.

Schema tables (in FK order): `user_profiles → agents → properties → listings → property_media`, `leads`

## Key routes

| Route | Description |
|-------|-------------|
| `/` | Home — featured listings |
| `/comprar` | Buy listings — filterable by `?q=&budget=` |
| `/rentar` | Rent listings |
| `/propiedades/[slug]` | Property detail + lead capture form |
| `/dashboard` | Agent dashboard (Clerk-protected) |
| `/dashboard/upload` | Photo upload UI (Clerk-protected) |
| `/api/leads` | `POST` — validate with Zod, persist to DB |
| `/api/leads/[id]` | `PATCH` — update lead status (agent-only, Zod-validated) |
| `/api/listings` | `GET ?type=sale\|rent&page=N` — paginated public listings JSON |
| `/api/listings/[slug]` | `GET` — published listing detail JSON for mobile/external clients |
| `/api/uploadthing` | UploadThing file router endpoint |

## Phase history

| Phase | Status | What shipped |
|-------|--------|-------------|
| S0 — Scaffold + UI | ✅ Shipped | Monorepo, domain types, property cards, lead form |
| S0+ — DB wiring | ✅ Shipped | Drizzle + Supabase, `POST /api/leads` persists rows |
| S1a — Search | ✅ Shipped | Client-side filter by city + budget via URL params |
| S1b — Auth | ✅ Shipped | Clerk middleware protects `/dashboard` |
| S2 — Dashboard | ✅ Shipped | Stats + leads table from DB |
| S3 — DB listings | ✅ Shipped | All listings served from Drizzle joins; seed script |
| S4 — Image upload | ✅ Shipped | UploadThing for property media, upload UI at `/dashboard/upload` |
| S5 — Lead status | ✅ Shipped | `PATCH /api/leads/[id]`, interactive status dropdown with optimistic update |
| S6 — Leads pagination | ✅ Shipped | Server-side `LIMIT/OFFSET` pagination, `COUNT` queries for stats, `?page=` URL param |
| S7a — API tests | ✅ Shipped | Vitest suite: 15 tests for `POST /api/leads` and `PATCH /api/leads/[id]` |
| S7b — Listings pagination | ✅ Shipped | `/comprar` and `/rentar` paginate at 24 items via `getListingsByType` |
| S7c — Expo API layer | ✅ Shipped | `GET /api/listings` + `GET /api/listings/[slug]` for mobile client |
| S7d — Expo wiring | ✅ Shipped | `ClerkProvider`, real data fetch, lead form submit, status-filtered detail |
| S8 — MVP polish | ✅ Shipped | Fraunces+Geist pairing, real hero images, mobile menu drawer, colored status pills, inline lead success state, es-ES money, a11y focus rings |
| S9 — Email notifications | ✅ Shipped | Resend integration on `POST /api/leads`, env-gated (skips silently if unconfigured), Vitest coverage for the dispatch path |
| S10 — Listings CRUD | ✅ Shipped | Dashboard listings table, status pills, transactional `POST /api/listings`, `PATCH /api/listings/[slug]` for status, new listing form |
| S11 — Lead detail + notes + filters | ✅ Shipped | `/dashboard/leads/[id]` with notes feed, `POST /api/leads/[id]/notes`, server-side status/intent/q filters preserving pagination |
| S12 — Hardening | ✅ Shipped | In-memory IP rate limit on `POST /api/leads` (10 req / 10 min), Vercel BotID enablement guide, Supabase RLS policy docs |

## Next roadmap: S13 i18n ES/EN

Goal: add Spanish and English language support without duplicating routes or drifting copy across web and mobile.

Recommended implementation order:

1. Create a shared `packages/i18n` workspace with typed message dictionaries for `es` and `en`.
2. Move reusable labels first: nav items, listing intent labels, form labels, validation copy, dashboard statuses, and empty/loading states.
3. Add locale detection and persistence on web via URL or cookie, then expose a compact language switcher in the header.
4. Add the same dictionary access pattern to mobile, with locale stored locally and a language control under Perfil.
5. Keep money/date formatting locale-aware through shared helpers, defaulting to Spanish until the user chooses English.

Acceptance gates:

- `npm run typecheck`
- `npm run lint`
- `npm run test --workspace @realtor/web`
- `npm run build --workspace @realtor/web`
- `npm run build --workspace @realtor/mobile`
- Manual smoke: switch ES/EN on home, buy/rent listings, property detail lead form, mobile explore, and mobile profile.

## Security & hardening

**Rate limit** — `POST /api/leads` enforces 10 requests per IP per 10 minutes via an in-memory bucket (`apps/web/src/lib/rate-limit.ts`). The implementation is per-instance, so when the app runs on Vercel Fluid Compute behind multiple instances, the budget is per-instance. For a stricter, cross-instance limit, swap the backing `Map` for Upstash Redis (`@upstash/ratelimit`) or Vercel KV.

**Vercel BotID** — to enable bot challenge on `POST /api/leads`, install the [BotID adapter](https://vercel.com/docs/botid) and wrap the route:

```ts
import { protect } from "@vercel/botid";

export async function POST(request: Request) {
  const verdict = await protect(request);
  if (verdict === "block") return new Response(null, { status: 403 });
  // ... existing flow
}
```

BotID is a Vercel platform feature, so it is left commented-out during local development.

**Supabase RLS** — apply the following policies once the project is moved to client-side queries. Today all writes go through server-only routes with `auth.protect()` so RLS is not yet load-bearing, but enable it before any client-side `@supabase/supabase-js` usage:

```sql
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_media ENABLE ROW LEVEL SECURITY;

-- Public can only read published listings + their media.
CREATE POLICY listings_public_read ON public.listings
  FOR SELECT TO anon, authenticated USING (status = 'published');

CREATE POLICY properties_public_read ON public.properties
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY property_media_public_read ON public.property_media
  FOR SELECT TO anon, authenticated USING (true);

-- Lead inserts are allowed to anyone (the API still validates with Zod).
CREATE POLICY leads_public_insert ON public.leads
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Reads, updates, and notes are agent-only via the service role used by Next.js.
-- The server-side Drizzle client uses the service role and bypasses RLS,
-- so no explicit policy is needed for write paths.
```

## Deployment

Target: Vercel. Update the CLI before deploying:

```bash
npm i -g vercel@latest
```
