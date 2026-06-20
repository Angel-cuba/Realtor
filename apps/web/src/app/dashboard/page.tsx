import { count, desc, eq, or } from "drizzle-orm";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Building2, UploadCloud } from "lucide-react";
import { db, leads } from "@realtor/db";
import { LeadsTable } from "@/components/leads-table";

const PAGE_SIZE = 10;

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  await auth.protect();
  const user = await currentUser();
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Math.floor(Number(pageParam) || 1));
  const offset = (page - 1) * PAGE_SIZE;

  const [[{ total }], [{ newCount }], [{ qualifiedCount }], pageLeads] = await Promise.all([
    db.select({ total: count() }).from(leads),
    db.select({ newCount: count() }).from(leads).where(eq(leads.status, "new")),
    db
      .select({ qualifiedCount: count() })
      .from(leads)
      .where(or(eq(leads.status, "qualified"), eq(leads.status, "tour_scheduled"))),
    db.select().from(leads).orderBy(desc(leads.createdAt)).limit(PAGE_SIZE).offset(offset),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  if (page > totalPages && total > 0) {
    redirect(`/dashboard?page=${totalPages}`);
  }

  const leadRows = pageLeads.map((lead) => ({
    id: lead.id,
    name: lead.name,
    email: lead.email,
    intent: lead.intent,
    status: lead.status,
    score: lead.score,
    createdAt: lead.createdAt.toISOString()
  }));

  return (
    <main className="min-h-[calc(100svh-4rem)] bg-linen">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-1 border-b border-black/10 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold">
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
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/45">Total leads</p>
            <p className="mt-2 text-4xl font-semibold">{total}</p>
          </div>
          <div className="rounded bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/45">Nuevos</p>
            <p className="mt-2 text-4xl font-semibold">{newCount}</p>
          </div>
          <div className="rounded bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/45">Calificados / Tour</p>
            <p className="mt-2 text-4xl font-semibold">{qualifiedCount}</p>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded bg-white">
          <div className="border-b border-black/10 px-6 py-4">
            <h2 className="font-semibold">Leads recientes</h2>
          </div>
          <LeadsTable key={page} leads={leadRows} page={page} totalPages={totalPages} />
        </div>
      </div>
    </main>
  );
}
