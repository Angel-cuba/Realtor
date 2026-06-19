import { desc } from "drizzle-orm";
import { auth, currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { UploadCloud } from "lucide-react";
import { db, leads } from "@realtor/db";

const statusLabel: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  tour_scheduled: "Tour scheduled",
  offer_intent: "Offer intent",
  negotiating: "Negotiating",
  won: "Won",
  lost: "Lost",
};

const intentLabel: Record<string, string> = {
  buy: "Buy",
  rent: "Rent",
  sell: "Sell",
  lease_out: "Lease out",
  general: "General",
};

export default async function DashboardPage() {
  await auth.protect();
  const user = await currentUser();

  const allLeads = await db.select().from(leads).orderBy(desc(leads.createdAt));

  const total = allLeads.length;
  const newLeads = allLeads.filter((l) => l.status === "new").length;
  const qualified = allLeads.filter((l) => l.status === "qualified" || l.status === "tour_scheduled").length;

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
          {allLeads.length === 0 ? (
            <p className="px-6 py-12 text-center text-black/45">Aun no hay leads registrados.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-black/10 text-left text-xs font-semibold uppercase tracking-[0.14em] text-black/45">
                    <th className="px-6 py-3">Nombre</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Intencion</th>
                    <th className="px-6 py-3">Estado</th>
                    <th className="px-6 py-3">Score</th>
                    <th className="px-6 py-3">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.06]">
                  {allLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-black/[0.02]">
                      <td className="px-6 py-4 font-medium">{lead.name}</td>
                      <td className="px-6 py-4 text-black/60">{lead.email}</td>
                      <td className="px-6 py-4">
                        <span className="rounded bg-linen px-2 py-1 text-xs font-medium">
                          {intentLabel[lead.intent] ?? lead.intent}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded bg-black/[0.04] px-2 py-1 text-xs font-medium">
                          {statusLabel[lead.status] ?? lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-moss">{lead.score}</td>
                      <td className="px-6 py-4 text-black/45">
                        {new Date(lead.createdAt).toLocaleDateString("es", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
