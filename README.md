# Realtor Platform

Monorepo for a premium real estate platform covering web, mobile, shared domain logic, and database schema.

## Apps

- `apps/web`: Next.js 16 App Router — public site, property listings, lead capture, and agent dashboard.
- `apps/mobile`: Expo companion app for search, favorites, tours, and agent follow-up (not active yet).
- `packages/domain`: shared types, validation, labels, and business rules.
- `packages/db`: Drizzle ORM schema and client for Supabase/Postgres.

## Current status

| Phase | Status |
|-------|--------|
| S0 — Scaffold + UI | ✅ Shipped |
| S0+ — DB wiring (leads API) | ✅ Shipped |
| S1a — Search filtering | ✅ Shipped |
| S1b — Clerk auth | ✅ Shipped |
| S2 — Agent dashboard | ✅ Shipped |
| S3 — Listings from DB | ⏳ In progress |
| S4 — Image upload | ⏳ Pending |
| S5 — Lead status management | ⏳ Pending |

## Local setup

```bash
# Use correct Node version (24.16.0)
nvm use

# Install dependencies
npm install

# Configure environment
cp .env.example apps/web/.env.local
# Fill in all values — see .env.example for required keys

# Start dev server
npm run dev:web
```

For mobile (when active):

```bash
npm run dev:mobile
```

## Environment

Use `.env.example` as the contract. Do not commit `.env` files.

Required integrations:

- Clerk for authentication and authorization.
- Supabase Postgres for data (use transaction pooler URL, port **6543**).
- UploadThing for media upload.
- Resend for transactional email.
- Vercel for web deployment.

## Database

```bash
npm run db:generate  # regenerate Drizzle migrations
npm run db:studio    # open Drizzle Studio
npm run db:seed      # seed DB with fixture listings (after S3)
```

**Important:** `DATABASE_URL` must use the Supabase transaction pooler (port 6543), not the direct connection (port 5432). Direct connections time out from local machines.

## Deployment

Update the Vercel CLI before deploying:

```bash
npm i -g vercel@latest
```
