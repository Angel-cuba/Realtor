import { desc } from "drizzle-orm";
import { auth, currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { UploadCloud } from "lucide-react";
import { db, leads } from "@realtor/db";
import { LeadsTable } from "@/components/leads-table";

export default async function DashboardPage() {
  await auth.protect();
  const user = await currentUser();

  const allLeads = await db.select().from(leads).orderBy(desc(leads.createdAt));

  const total = allLeads.length;
  const newLeads = allLeads.filter((l) => l.status === "new").length;
  const qualified = allLeads.filter((l) => l.status === "qualified" || l.status === "tour_scheduled").length;
  const leadRows = allLeads.map((lead) => ({
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
          <Link
            className="inline-flex items-center justify-center gap-2 rounded bg-ink px-5 py-3 text-sm font-semibold text-white"
            href="/dashboard/upload"
          >
            <UploadCloud size={17} aria-hidden />
            Subir fotos
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/45">Total leads</p>
            <p className="mt-2 text-4xl font-semibold">{total}</p>
          </div>
          <div className="rounded bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/45">Nuevos</p>
            <p className="mt-2 text-4xl font-semibold">{newLeads}</p>
          </div>
          <div className="rounded bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/45">Calificados / Tour</p>
            <p className="mt-2 text-4xl font-semibold">{qualified}</p>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded bg-white">
          <div className="border-b border-black/10 px-6 py-4">
            <h2 className="font-semibold">Leads recientes</h2>
          </div>
          <LeadsTable allLeads={leadRows} />
        </div>
      </div>
    </main>
  );
}
