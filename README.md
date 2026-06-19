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
│   └── mobile/       — Expo companion app (not active yet)
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

> `DATABASE_URL` must point to the **transaction pooler** (port 6543), not the direct connection (port 5432). Direct connections time out from local machines.

## Database commands

```bash
npm run db:generate   # regenerate Drizzle migration files after schema changes
npm run db:studio     # open Drizzle Studio (visual DB browser)
npm run db:seed       # seed 6 fixture listings with agents and media rows
```

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
| S5 — Lead status | ⏳ Pending | `PATCH /api/leads/[id]`, status dropdown in dashboard |

## Deployment

Target: Vercel. Update the CLI before deploying:

```bash
npm i -g vercel@latest
```
