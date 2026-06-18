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
│   └── db/           — Drizzle ORM schema, client, seed script
├── drizzle.config.ts — Drizzle-kit config (reads apps/web/.env.local)
└── .env.example      — All required environment variables
```

**Key workspace packages:**
- `@realtor/domain` — `PropertyListing` type, `leadInputSchema`, `formatMoney`, label helpers
- `@realtor/db` — `db` Drizzle client, all table exports (`leads`, `listings`, `agents`, `propertyMedia`, etc.)

---

### Tech stack

| Layer | Tech | Version |
|-------|------|---------|
| Framework | Next.js App Router | 16.2.9 |
| Language | TypeScript (strict) | 6.x |
| Styling | Tailwind CSS | — |
| Auth | Clerk | 7.5.3 |
| ORM | Drizzle ORM | 0.45.x |
| Database | Supabase (Postgres) | — |
| Media upload | UploadThing | v7 |
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
| S0 | ✅ Done | Monorepo scaffold, domain package, UI components, lead form |
| S0+ | ✅ Done | Drizzle + Supabase wired, `leads` table in DB, `POST /api/leads` persists rows |
| S1a | ✅ Done | `SearchPanel` client component filters by city text + budget, pushes URL params |
| S1b | ✅ Done | Clerk middleware protects `/dashboard`, `ClerkProvider` in layout, `AuthNav` in header |
| S2 | ✅ Done | `/dashboard` page fetches leads from Supabase, shows stats + table |
| MVP-cleanup | ✅ Done | `PropertyImage` placeholder (icon + label centered on `bg-ink`), all broken image paths cleared |
| S3 | ✅ Done | `listings.ts` replaced with Drizzle queries; seed script inserts 6 listings with agents, properties, and media |

**Key files:**
- `apps/web/src/app/page.tsx` — home page (async, `getFeaturedListings()` from DB)
- `apps/web/src/app/comprar/page.tsx` — buy listings (server component, reads `searchParams`)
- `apps/web/src/app/rentar/page.tsx` — rent listings
- `apps/web/src/app/propiedades/[slug]/page.tsx` — property detail + lead form; `generateStaticParams` queries DB
- `apps/web/src/app/dashboard/page.tsx` — protected agent dashboard (leads table)
- `apps/web/src/app/api/leads/route.ts` — POST endpoint, validates with Zod, inserts to DB
- `apps/web/src/components/property-image.tsx` — shows centered Building2 icon placeholder when `src` is empty; renders real URL when present — **no changes needed for S4**
- `apps/web/src/lib/listings.ts` — Drizzle queries (joins listings + properties + agents + user_profiles + property_media)
- `packages/db/src/schema.ts` — full DB schema including `propertyMedia` table
- `packages/db/src/seed.ts` — seeds 6 listings idempotently (`onConflictDoNothing`)
- `apps/web/src/middleware.ts` — Clerk middleware, protects `/dashboard`

---

### ⚠️ Critical env var note

`DATABASE_URL` **must** use the Supabase **transaction pooler** (port 6543), not the direct connection (port 5432). Direct connections time out from local machines due to IPv6 routing.

```
DATABASE_URL=postgresql://postgres.xbwxjtxkmanphogltrok:[PASSWORD]@aws-0-eu-west-1.pooler.supabase.com:6543/postgres
```

---

### Active phase — what to build NOW

#### S4 — Property image upload (UploadThing)

**Goal:** Agents can upload photos for a listing from the dashboard. Uploaded images are stored in `property_media` and rendered immediately on listing cards and detail pages.

**`UPLOADTHING_TOKEN` is already in `apps/web/.env.local`** — do not change or add it.

---

**Step 1 — Install UploadThing in `apps/web`**

```bash
npm install uploadthing @uploadthing/react --workspace @realtor/web
```

---

**Step 2 — Create the file router**

`apps/web/src/app/api/uploadthing/route.ts`:

```typescript
import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "@/lib/uploadthing";

export const { GET, POST } = createRouteHandler({ router: ourFileRouter });
```

`apps/web/src/lib/uploadthing.ts`:

```typescript
import { currentUser } from "@clerk/nextjs/server";
import { createUploadthing, UploadThingError, type FileRouter } from "uploadthing/next";
import { z } from "zod";
import { db, propertyMedia } from "@realtor/db";
import { and, eq } from "drizzle-orm";
import { generateReactHelpers } from "@uploadthing/react";

const f = createUploadthing();

export const ourFileRouter = {
  listingImageUploader: f({ image: { maxFileSize: "8MB", maxFileCount: 10 } })
    .input(z.object({ listingId: z.string().uuid() }))
    .middleware(async ({ input }) => {
      const user = await currentUser();
      if (!user) throw new UploadThingError("Unauthorized");
      return { userId: user.id, listingId: input.listingId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Delete placeholder rows (url = '') so the real image takes sortOrder 0
      await db
        .delete(propertyMedia)
        .where(and(eq(propertyMedia.listingId, metadata.listingId), eq(propertyMedia.url, "")));

      // Count remaining real rows to determine sortOrder for new image
      const existing = await db
        .select({ id: propertyMedia.id })
        .from(propertyMedia)
        .where(eq(propertyMedia.listingId, metadata.listingId));

      await db.insert(propertyMedia).values({
        listingId: metadata.listingId,
        url: file.url,
        alt: file.name,
        sortOrder: existing.length
      });

      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

export const { useUploadThing, UploadButton, UploadDropzone } =
  generateReactHelpers<OurFileRouter>();
```

**Notes on the placeholder-replacement logic:**
- The seed script creates one `property_media` row per listing with `url: ""` and `sortOrder: 0`
- When the first real image is uploaded, we UPDATE that row instead of inserting a new one at sortOrder 0 (so the card image slot renders correctly)
- Subsequent uploads INSERT new rows at incrementing sortOrders

---

**Step 3 — Create the upload UI in the dashboard**

Add a new page at `apps/web/src/app/dashboard/upload/page.tsx` (Clerk-protected via middleware already).

The page should:
1. Fetch all published listings from the DB: `id`, `slug`, `title`
2. Render a form with a listing `<select>` and an upload component
3. On listing change, show existing photos for that listing
4. On upload, trigger UploadThing with `input: { listingId }` and refresh

Use the generated `UploadButton` or `UploadDropzone` (both are client components — mark the upload section `"use client"`).

The dashboard page layout is at `apps/web/src/app/dashboard/page.tsx`. Add a nav link to the upload page from there (or add it to the site header for authenticated users — your call).

---

**Step 4 — Verify end-to-end**

1. Upload an image via the dashboard
2. Check `property_media` in Supabase: the URL should be a `ufs.sh` CDN domain
3. Visit `/comprar` — the property card should now show the real image instead of the placeholder icon
4. Visit the property detail page — main image slot renders the photo

---

**Acceptance criteria:**
- [ ] `npm install` completes without errors
- [ ] `GET /api/uploadthing` returns 200 (UploadThing health)
- [ ] Upload UI accessible at `/dashboard/upload` (requires login)
- [ ] Uploading an image for a listing stores a real URL in `property_media.url`
- [ ] `/comprar` and `/propiedades/[slug]` render the real photo (no placeholder icon for uploaded listings)
- [ ] TypeScript: `npx tsc --project apps/web/tsconfig.json --noEmit` returns 0 errors

---

### Upcoming phases (build after S4)

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

# 3. Start dev server
npm run dev:web   # http://localhost:3000

# 4. Seed DB (idempotent — safe to re-run)
npm run db:seed

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
UPLOADTHING_TOKEN=...
```

---

### Coding conventions

1. **No comments** unless the WHY is non-obvious (hidden constraint, workaround).
2. **No unused imports** — TypeScript strict mode catches them; fix before committing.
3. **Server components by default** — only add `"use client"` when needed (event handlers, hooks, browser APIs). The upload zone must be a client component.
4. **Next.js 16 params** — `params` and `searchParams` are `Promise<...>` — always `async`/`await` them.
5. **Placeholders** — `PropertyImage` with `src=""` shows the icon placeholder automatically; with a real URL it renders the photo. No changes to that component needed.
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
| DB seed | `packages/db/src/seed.ts` |
| Domain types | `packages/domain/src/index.ts` |
| Listings DB queries | `apps/web/src/lib/listings.ts` |
| UploadThing router | `apps/web/src/lib/uploadthing.ts` (create in S4) |
| Tailwind config | `apps/web/tailwind.config.ts` |
| Clerk middleware | `apps/web/src/middleware.ts` |
| API routes | `apps/web/src/app/api/` |
| Global layout | `apps/web/src/app/layout.tsx` |
