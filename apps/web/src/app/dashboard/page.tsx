import { and, count, desc, eq, ilike, or, type SQL } from "drizzle-orm";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Building2, UploadCloud } from "lucide-react";
import { db, leads } from "@realtor/db";
import { leadIntents, leadStatuses, type LeadIntent, type LeadStatus } from "@realtor/domain";
import { LeadsFilter } from "@/components/leads-filter";
import { LeadsTable } from "@/components/leads-table";

const PAGE_SIZE = 10;

function pickEnum<T extends readonly string[]>(allowed: T, value: string | undefined): T[number] | "" {
  if (value && (allowed as readonly string[]).includes(value)) return value as T[number];
  return "";
}

function buildPageHref(page: number, filters: { status: string; intent: string; q: string }) {
  const sp = new URLSearchParams();
  if (filters.status) sp.set("status", filters.status);
  if (filters.intent) sp.set("intent", filters.intent);
  if (filters.q) sp.set("q", filters.q);
  if (page > 1) sp.set("page", String(page));
  return sp.size ? `/dashboard?${sp.toString()}` : "/dashboard";
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string; intent?: string; q?: string }>;
}) {
  await auth.protect();
  const user = await currentUser();
  const sp = await searchParams;

  const page = Math.max(1, Math.floor(Number(sp.page) || 1));
  const status = pickEnum(leadStatuses, sp.status);
  const intent = pickEnum(leadIntents, sp.intent);
  const q = (sp.q ?? "").trim().slice(0, 80);

  const filters: SQL[] = [];
  if (status) filters.push(eq(leads.status, status as LeadStatus));
  if (intent) filters.push(eq(leads.intent, intent as LeadIntent));
  if (q) {
    const pattern = `%${q}%`;
    const orClause = or(ilike(leads.name, pattern), ilike(leads.email, pattern));
    if (orClause) filters.push(orClause);
  }
  const filterWhere = filters.length > 0 ? and(...filters) : undefined;

  const offset = (page - 1) * PAGE_SIZE;
  const filterArgs = { status, intent, q };

  const [[{ total }], [{ filtered }], [{ newCount }], [{ qualifiedCount }], pageLeads] = await Promise.all([
    db.select({ total: count() }).from(leads),
    db
      .select({ filtered: count() })
      .from(leads)
      .where(filterWhere ?? undefined),
    db.select({ newCount: count() }).from(leads).where(eq(leads.status, "new")),
    db
      .select({ qualifiedCount: count() })
      .from(leads)
      .where(or(eq(leads.status, "qualified"), eq(leads.status, "tour_scheduled"))),
    db
      .select()
      .from(leads)
      .where(filterWhere ?? undefined)
      .orderBy(desc(leads.createdAt))
      .limit(PAGE_SIZE)
      .offset(offset),
  ]);

  const totalPages = Math.max(1, Math.ceil(filtered / PAGE_SIZE));

  if (page > totalPages && filtered > 0) {
    redirect(buildPageHref(totalPages, filterArgs));
  }

  const leadRows = pageLeads.map((lead) => ({
    id: lead.id,
    name: lead.name,
    email: lead.email,
    intent: lead.intent,
    status: lead.status,
    score: lead.score,
    createdAt: lead.createdAt.toISOString(),
  }));

  const hasActiveFilters = Boolean(status || intent || q);

  return (
    <main className="min-h-[calc(100svh-4rem)] bg-linen">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-1 border-b border-black/10 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Dashboard</p>
            <h1 className="mt-2 font-display text-3xl font-medium tracking-tight">
              {user?.firstName ? `Hola, ${user.firstName}` : "Panel de agente"}
            </h1>
          </div>
          <div className="flex gap-2">
            <Link
              className="inline-flex items-center justify-center gap-2 rounded border border-black/15 px-5 py-3 text-sm font-semibold transition-colors hover:bg-black/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
              href="/dashboard/listings"
            >
              <Building2 size={17} aria-hidden />
              Propiedades
            </Link>
            <Link
              className="inline-flex items-center justify-center gap-2 rounded bg-ink px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
              href="/dashboard/upload"
            >
              <UploadCloud size={17} aria-hidden />
              Subir fotos
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/55">Total leads</p>
            <p className="mt-2 font-display text-4xl font-medium tracking-tight">{total}</p>
          </div>
          <div className="rounded bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/55">Nuevos</p>
            <p className="mt-2 font-display text-4xl font-medium tracking-tight">{newCount}</p>
          </div>
          <div className="rounded bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/55">Calificados / Tour</p>
            <p className="mt-2 font-display text-4xl font-medium tracking-tight">{qualifiedCount}</p>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded bg-white">
          <div className="flex items-center justify-between border-b border-black/10 px-6 py-4">
            <h2 className="font-semibold">Leads</h2>
            <span className="text-xs text-black/55">
              {hasActiveFilters ? `${filtered} de ${total}` : `${total} totales`}
            </span>
          </div>
          <LeadsFilter defaultStatus={status} defaultIntent={intent} defaultQ={q} />
          <LeadsTable
            key={`${page}-${status}-${intent}-${q}`}
            leads={leadRows}
            page={page}
            totalPages={totalPages}
            pageHrefBuilder={(p) => buildPageHref(p, filterArgs)}
          />
        </div>
      </div>
    </main>
  );
}
