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
| MVP-cleanup | ✅ Done | `PropertyImage` component with `bg-ink` placeholder, all `const-*.webp` paths cleared |

**Key files:**
- `apps/web/src/app/page.tsx` — home page
- `apps/web/src/app/comprar/page.tsx` — buy listings (server component, reads `searchParams`)
- `apps/web/src/app/rentar/page.tsx` — rent listings
- `apps/web/src/app/propiedades/[slug]/page.tsx` — property detail + lead form
- `apps/web/src/app/dashboard/page.tsx` — protected agent dashboard (leads table)
- `apps/web/src/components/property-image.tsx` — shows `bg-ink` placeholder when `src` is empty
- `apps/web/src/lib/listings.ts` — static fixture (all `image: ""`, `gallery: []`)
- `apps/web/src/middleware.ts` — Clerk middleware, protects `/dashboard`

---

### Active phases — what to build next

#### S3 — Listings from database

**Goal:** Replace the static fixture in `apps/web/src/lib/listings.ts` with real data from the `listings` + `properties` + `agents` tables in Supabase.

**Acceptance criteria:**
- `GET /api/listings` returns published listings (join `listings` + `properties` + `agents`)
- `apps/web/src/lib/listings.ts` still exports the same helper functions (`getListingsByType`, `getListingBySlug`, `getFeaturedListings`, `filterListings`) but queries the DB instead of a static array
- `generateStaticParams` in the detail page falls back gracefully if DB is unavailable during build
- The `PropertyListing` type in `@realtor/domain` matches what the DB returns
- An admin seed script exists at `packages/db/src/seed.ts` with at least the 6 existing fixture listings as rows

**Notes:**
- The DB schema has `listings`, `properties`, `agents`, `property_media` tables — join them for a full listing object
- Use `db.select().from(listings).innerJoin(...)` with Drizzle
- Server components can call DB directly (no API route needed for reads)
- `property_media` replaces the `image`/`gallery` fields; the first media row is the cover

---

#### S4 — Property image upload (UploadThing)

**Goal:** Agents can upload photos for a listing from the dashboard.

**Acceptance criteria:**
- `UPLOADTHING_TOKEN` env var is configured (already in `.env.example`)
- `apps/web/src/app/api/uploadthing/route.ts` exposes the UploadThing handler
- Dashboard has a simple upload UI for property media (attach to a listing by slug/id)
- Uploaded URLs are saved to `property_media` table
- `PropertyImage` renders the real URL when present

---

#### S5 — Lead status management in dashboard

**Goal:** Agents can update the status of a lead from the dashboard table.

**Acceptance criteria:**
- Each lead row has a status dropdown (`new → contacted → qualified → tour_scheduled → ...`)
- Status updates go through a `PATCH /api/leads/[id]` route
- Optimistic UI update (no full page reload)
- Only authenticated users (Clerk) can update leads

---

### Setup

```bash
# 1. Use correct Node version
nvm use   # reads .nvmrc → 24.16.0

# 2. Install dependencies
npm install

# 3. Configure environment — copy and fill in all values
cp .env.example apps/web/.env.local

# 4. Start dev server
npm run dev:web   # http://localhost:3000 (or 3001)

# 5. TypeScript check
npx tsc --project apps/web/tsconfig.json --noEmit
```

**Required env vars to fill (in `apps/web/.env.local`):**
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/dashboard
DATABASE_URL=postgresql://...  (Supabase transaction pooler URL, port 6543)
```

---

### Coding conventions

1. **No comments** unless the WHY is non-obvious (hidden constraint, workaround).
2. **No unused imports** — TypeScript strict mode catches them; fix before committing.
3. **Server components by default** — only add `"use client"` when needed (event handlers, hooks, browser APIs).
4. **Next.js 15+ params** — `params` and `searchParams` are `Promise<...>` — always `async`/`await` them.
5. **Placeholders** — use `PropertyImage` with `src=""` for missing images (never import sample images).
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
