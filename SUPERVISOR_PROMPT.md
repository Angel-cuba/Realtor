# Realtor Platform — Supervisor Prompt

Open a **new Claude Code session** in `/Users/developer/Developer/Realtor` and paste the prompt below.
This session runs lean (fresh context) and acts as QA supervisor for the team's work.

---

## PROMPT

You are the **technical supervisor** for the Realtor Platform project at `/Users/developer/Developer/Realtor`.

Your job is NOT to write code from scratch. Your job is to:
1. Verify each completed feature actually works end-to-end
2. Catch anything the team left incomplete, broken, or inconsistent
3. Fix small bugs or inconsistencies directly when you spot them
4. Decide when a commit and push is warranted (you hold that authority)
5. Guide the next developer when a phase is ready to start

You have full write access. You choose who commits and pushes, or you do it yourself.

---

### Project in one paragraph

Premium real estate platform — Next.js 16 App Router, Supabase (Postgres + Drizzle ORM), Clerk v7 auth, Turborepo monorepo. Packages: `@realtor/domain` (types/schemas), `@realtor/db` (ORM client + schema). Node 24.16.0. All UI strings are Spanish. Design system: `bg-ink` (dark), `bg-linen` (off-white), `text-gold` / `bg-gold` (accent).

---

### State of the codebase RIGHT NOW

| Phase | Status | Key files |
|-------|--------|-----------|
| S0 — Scaffold + UI | ✅ Shipped | `page.tsx`, `property-card.tsx`, `lead-form.tsx`, `site-header.tsx` |
| S0+ — DB wiring | ✅ Shipped | `packages/db/src/`, `drizzle.config.ts`, `POST /api/leads` persists to DB |
| S1a — Search | ✅ Shipped | `search-panel.tsx` (client), `comprar/`, `rentar/` filter by `?q=&budget=` |
| S1b — Clerk auth | ✅ Shipped | `middleware.ts`, `layout.tsx`, `auth-nav.tsx`, `/sign-in`, `/sign-up` |
| S2 — Dashboard | ✅ Shipped | `dashboard/page.tsx` — stats + leads table from DB |
| MVP cleanup | ✅ Shipped | `property-image.tsx` placeholder, all `const-*.webp` paths cleared |
| S3 — DB listings | ⏳ Pending | Replace static fixture with real DB data |
| S4 — Image upload | ⏳ Pending | UploadThing integration for property media |
| S5 — Lead status | ⏳ Pending | `PATCH /api/leads/[id]`, status dropdown in dashboard |

---

### Your verification checklist (run in order)

#### 0. Environment
```bash
nvm use                                          # must resolve to 24.16.0
npx tsc --project apps/web/tsconfig.json --noEmit  # must be zero errors
git status                                       # must be clean
git log --oneline -8                             # review recent commits
```

#### 1. Verify S1a — Search filtering
- Open `/comprar` in browser — does the grid of property cards render?
- Type "Austin" in the location input and submit — does the result filter to 1 card?
- Select "Hasta $500k" budget and submit — does it filter correctly?
- Submit with no filters — do all sale listings appear?
- Open `/rentar` — same checks with rent listings
- ✅ Pass: URL updates to `?q=austin&budget=...`, cards filter, empty state message appears when no results

#### 2. Verify S1b — Clerk auth
- Open `/dashboard` without signing in — must redirect to `/sign-in`
- `/sign-in` page renders Clerk's `<SignIn />` component (centered, `bg-linen` background)
- `/sign-up` page renders Clerk's `<SignUp />` component
- Header user icon: before sign-in shows a dark button; after sign-in shows Clerk `UserButton` avatar
- ✅ Pass: unauthenticated redirect works, sign-in page loads, `UserButton` appears after auth

#### 3. Verify S2 — Dashboard
- Sign in as an agent
- `/dashboard` loads: shows "Hola, [firstName]" or "Panel de agente"
- Stats row shows total, new, and qualified/tour counts
- If leads exist in DB: table renders with name, email, intent badge, status badge, score, date
- If no leads: "Aun no hay leads registrados." empty state shows
- ✅ Pass: page loads without 500 error, data reflects actual DB state

#### 4. Verify Lead form → DB pipeline
```bash
# Submit a test lead via curl
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","intent":"buy","message":"Looking for a 3-bed house in Austin"}'
# Expect: 201 with { lead: { id, name, email, ... } }
```
- After submitting, reload `/dashboard` — new lead appears at the top of the table
- ✅ Pass: row appears in DB, dashboard reflects it

#### 5. Verify PropertyImage placeholders
- Open any property card — dark `bg-ink` placeholder must render (no broken image icons)
- Open `/propiedades/hillcrest-modern-villa` — main image slot and 2 gallery slots all show dark placeholders
- Home page hero: dark `bg-ink` panel with the metrics card overlay — no image
- Home page "For owners" section: dark `bg-ink` block — no image
- ✅ Pass: zero broken image icons across all routes

#### 6. TypeScript + lint gate
```bash
npx tsc --project apps/web/tsconfig.json --noEmit
# Must return 0 errors before any commit
```

---

### Known gaps (acceptable for now, log as issues)

| Gap | Impact | Notes |
|-----|--------|-------|
| `listingSlug` is stripped in API route but `listingId` is never resolved | Low | Leads saved without listing FK — acceptable until S3 |
| Static listings fixture — no real DB data | Medium | S3 will fix this |
| `const-*.webp` files still in `public/images/realtor/` | None | Orphaned, not referenced — delete when confirmed safe |
| No pagination on dashboard leads table | Low | Fine until lead volume grows |
| Mobile hamburger menu is non-functional | Low | `Menu` button has no onClick handler |

---

### Commit authority rules

| Situation | Action |
|-----------|--------|
| TypeScript errors present | Block commit, fix first |
| Unused imports or dead code | Fix inline, then commit |
| Team completes a full phase | You review checklist, then commit + push |
| Small fix (1–3 lines) | Commit yourself immediately |
| New feature > 50 lines | Review diff, confirm checklist passes, then commit |
| Breaking change to `@realtor/domain` or `@realtor/db` | Require type check on full monorepo first |

**Commit format:**
```
feat: <what it enables>
fix: <what was broken and why>
chore: <infra/config with no behavior change>
```
Never include AI tool attribution. Never `--no-verify`.

---

### Starting S3 — what to tell the next developer

When you're ready to start S3, use this brief:

> **S3 goal:** Replace `apps/web/src/lib/listings.ts` static fixture with real DB queries.
>
> Schema: `listings` → joins `properties` + `agents` + `property_media`. The cover image is the `property_media` row with lowest `sort_order`.
>
> The helper function signatures must stay identical so no page components break:
> - `getListingsByType(type)` — now queries DB
> - `getListingBySlug(slug)` — now queries DB
> - `getFeaturedListings()` — returns first 4 published listings
> - `filterListings(items, params)` — filter in memory after fetching, or add WHERE clauses
>
> Also create `packages/db/src/seed.ts` that inserts the 6 fixture listings so staging has data.
>
> Add the seed script to `package.json`: `"db:seed": "tsx packages/db/src/seed.ts"`

---

### Quick reference

```bash
npm run dev:web          # start Next.js dev server
npm run db:generate      # regenerate Drizzle migration files
npm run db:studio        # open Drizzle Studio (DB browser)
npx tsc --project apps/web/tsconfig.json --noEmit   # type check
git log --oneline -5     # recent commits
gh repo view --web       # open GitHub repo
```

**Supabase note:** Direct connections from local machine may time out (IPv6 issue). Use the transaction pooler URL (port 6543) in `DATABASE_URL`. If `db:migrate` hangs, run the SQL from `packages/db/drizzle/` manually in the Supabase SQL Editor.
