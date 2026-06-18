# Realtor Platform — Team Onboarding Prompt

Paste this prompt into a new Claude Code session to start working on the project.

---

## PROMPT

You are a senior fullstack engineer joining the **Realtor Platform** project. The repository is at `/Users/developer/Developer/Realtor`. Read this document fully before touching any file.

---

### What this project is

A premium real estate web platform (monorepo) for buying, renting, and selling properties. Target: agents and property owners in Spanish-speaking markets. The product is a Next.js web app backed by Supabase (Postgres) and Clerk authentication.

---

### Monorepo structure

```
/
├── apps/
│   ├── web/          — Next.js 16 App Router (primary app)
│   └── mobile/       — React Native (not active yet)
├── packages/
│   ├── domain/       — Shared TypeScript types + Zod schemas + formatters
│   └── db/           — Drizzle ORM schema, client, migrations
├── drizzle.config.ts — Drizzle-kit config (reads apps/web/.env.local)
└── .env.example      — All required environment variables
```

**Key workspace packages:**
- `@realtor/domain` — `PropertyListing` type, `leadInputSchema`, `formatMoney`, label helpers
- `@realtor/db` — `db` Drizzle client, all table exports (`leads`, `listings`, `agents`, etc.)

---

### Tech stack

| Layer | Tech | Version |
|-------|------|---------|
| Framework | Next.js App Router | 16.2.9 |
| Language | TypeScript (strict) | 5.x |
| Styling | Tailwind CSS | — |
| Auth | Clerk | 7.5.3 |
| ORM | Drizzle ORM | — |
| Database | Supabase (Postgres) | — |
| Monorepo | Turborepo + npm workspaces | — |
| Node | 24.16.0 (`.nvmrc`) | — |

**Design tokens** (defined in Tailwind config):
- `bg-ink` — primary dark background
- `bg-linen` — warm off-white page background
- `text-gold` / `bg-gold` — accent color
- `text-moss` — secondary accent (green)

---

### What is already built (do not rebuild)

| Phase | Status | What it does |
|-------|--------|-------------|
| S0 | ✅ Done | Monorepo scaffold, domain package, UI components, listings fixture, lead form |
| S0+ | ✅ Done | Drizzle + Supabase wired, `leads` table in DB, `POST /api/leads` persists rows |
| S1a | ✅ Done | `SearchPanel` client component filters by city text + budget, pushes URL params |
| S1b | ✅ Done | Clerk middleware protects `/dashboard`, `ClerkProvider` in layout, `AuthNav` in header |
| S2 | ✅ Done | `/dashboard` page fetches leads from Supabase, shows stats + table |
| MVP-cleanup | ✅ Done | `PropertyImage` placeholder (icon + label centered on `bg-ink`), all broken image paths cleared |

**Key files:**
- `apps/web/src/app/page.tsx` — home page
- `apps/web/src/app/comprar/page.tsx` — buy listings (server component, reads `searchParams`)
- `apps/web/src/app/rentar/page.tsx` — rent listings
- `apps/web/src/app/propiedades/[slug]/page.tsx` — property detail + lead form
- `apps/web/src/app/dashboard/page.tsx` — protected agent dashboard (leads table)
- `apps/web/src/app/api/leads/route.ts` — POST endpoint, validates with Zod, inserts to DB, returns 500 on error
- `apps/web/src/components/property-image.tsx` — shows centered Building2 icon placeholder when `src` is empty
- `apps/web/src/lib/listings.ts` — static fixture (all `image: ""`, `gallery: []`) — **S3 replaces this**
- `apps/web/src/middleware.ts` — Clerk middleware, protects `/dashboard`

---

### ⚠️ Critical env var note

`DATABASE_URL` **must** use the Supabase **transaction pooler** (port 6543), not the direct connection (port 5432). Direct connections time out from local machines due to IPv6 routing.

```
# Correct format (get exact URL from Supabase Dashboard → Settings → Database → Transaction pooler):
DATABASE_URL=postgresql://postgres.xbwxjtxkmanphogltrok:[PASSWORD]@aws-0-eu-west-1.pooler.supabase.com:6543/postgres
```

---

### Active phase — what to build NOW

#### S3 — Listings from database

**Goal:** Replace the static fixture in `apps/web/src/lib/listings.ts` with real data from the `listings` + `properties` + `agents` + `property_media` tables in Supabase.

**Acceptance criteria:**
- `apps/web/src/lib/listings.ts` still exports the same helper functions (`getListingsByType`, `getListingBySlug`, `getFeaturedListings`, `filterListings`) but queries the DB instead of a static array
- `generateStaticParams` in `propiedades/[slug]/page.tsx` also updates to query DB (currently imports the static `listings` array directly — change to a DB call)
- The `PropertyListing` type in `@realtor/domain` matches what the DB returns (or create a mapper)
- A seed script exists at `packages/db/src/seed.ts` with the 6 fixture listings as rows
- `package.json` at root gets `"db:seed": "tsx packages/db/src/seed.ts"`

**Schema to join:**
- `listings` → `properties` (inner join on `property_id`)
- `listings` → `agents` (left join on `agent_id`)
- `property_media` → filtered by `listing_id`, ordered by `sort_order ASC` — first row is the cover image; rest are gallery

**Seed order (FK dependencies):**
1. `user_profiles` (required by `agents.user_id`)
2. `agents` (required by `listings.agent_id`)
3. `properties` (required by `listings.property_id`)
4. `listings` (required by `property_media.listing_id`)
5. `property_media` (`image: ""` for now — S4 adds UploadThing)

**Notes:**
- Server components can call DB directly (no API route needed for reads)
- `filterListings` can keep filtering in memory after the DB fetch, or add WHERE clauses — either is fine for now
- Run `npm run db:seed` after writing the script to verify rows appear in Supabase

---

### Upcoming phases (build after S3)

#### S4 — Property image upload (UploadThing)

**Goal:** Agents can upload photos for a listing from the dashboard.

**Acceptance criteria:**
- `UPLOADTHING_TOKEN` env var configured (already in `.env.example`)
- `apps/web/src/app/api/uploadthing/route.ts` exposes the UploadThing handler
- Dashboard has a simple upload UI (attach to a listing by slug/id)
- Uploaded URLs saved to `property_media` table
- `PropertyImage` renders real URLs when present (placeholder stays for empty `src`)

---

#### S5 — Lead status management in dashboard

**Goal:** Agents can update the status of a lead from the dashboard table.

**Acceptance criteria:**
- Each lead row has a status dropdown (`new → contacted → qualified → tour_scheduled → ...`)
- Status updates through a `PATCH /api/leads/[id]` route (validate with Zod, auth-guard with Clerk)
- Optimistic UI update — no full page reload

---

### Setup

```bash
# 1. Use correct Node version
nvm use   # reads .nvmrc → 24.16.0

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example apps/web/.env.local
# Fill in all values — especially DATABASE_URL with the pooler URL (port 6543)

# 4. Start dev server
npm run dev:web   # http://localhost:3000

# 5. TypeScript check (must be zero errors before any commit)
npx tsc --project apps/web/tsconfig.json --noEmit
```

**Required env vars (`apps/web/.env.local`):**
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/dashboard
DATABASE_URL=postgresql://postgres.xbwxjtxkmanphogltrok:[PASSWORD]@aws-0-eu-west-1.pooler.supabase.com:6543/postgres
```

---

### Coding conventions

1. **No comments** unless the WHY is non-obvious (hidden constraint, workaround).
2. **No unused imports** — TypeScript strict mode catches them; fix before committing.
3. **Server components by default** — only add `"use client"` when needed (event handlers, hooks, browser APIs).
4. **Next.js 16 params** — `params` and `searchParams` are `Promise<...>` — always `async`/`await` them.
5. **Placeholders** — use `PropertyImage` with `src=""` for missing images (never import local image files).
6. **DB queries** — always use the `db` client from `@realtor/db`; never raw SQL strings.
7. **Zod validation** — all API route inputs must go through a Zod schema before touching the DB.

### Git conventions

- Conventional commits: `feat:`, `fix:`, `chore:`, `refactor:`
- One logical change per commit — no mega-commits
- **Never include AI tool attribution** in commits or PR descriptions
- Run `npx tsc --project apps/web/tsconfig.json --noEmit` before every commit

---

### Where things live

| Thing | Location |
|-------|----------|
| DB schema | `packages/db/src/schema.ts` |
| DB client | `packages/db/src/client.ts` |
| Domain types | `packages/domain/src/index.ts` |
| Tailwind config | `apps/web/tailwind.config.ts` |
| Clerk middleware | `apps/web/src/middleware.ts` |
| API routes | `apps/web/src/app/api/` |
| Global layout | `apps/web/src/app/layout.tsx` |
