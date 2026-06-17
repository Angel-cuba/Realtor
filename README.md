# Realtor Platform

Monorepo for a premium real estate platform covering web, mobile, shared domain logic, and database schema.

## Apps

- `apps/web`: Next.js App Router public site and lead capture.
- `apps/mobile`: Expo companion app for search, favorites, tours, and agent follow-up.
- `packages/domain`: shared types, validation, labels, and business rules.
- `packages/db`: Drizzle schema for Supabase/Postgres.

## Phase 1 scope

- Public home with premium visual direction.
- Buy and rent listing pages.
- Property detail pages.
- Lead capture API.
- Expo mobile explore and property detail screens.
- Shared domain contracts for listings, roles, statuses, and leads.

## Local setup

Use Node `24.3.0` or newer:

```bash
nvm use
```

```bash
npm install
cp .env.example .env.local
npm run dev:web
```

For mobile:

```bash
npm run dev:mobile
```

## Environment

Use `.env.example` as the contract. Do not commit `.env` files.

Required integrations:

- Clerk for authentication and authorization.
- Supabase Postgres for data.
- UploadThing for media upload.
- Resend for transactional email.
- Vercel for web deployment.

## Deployment note

Update the Vercel CLI before deploying:

```bash
npm i -g vercel@latest
```
