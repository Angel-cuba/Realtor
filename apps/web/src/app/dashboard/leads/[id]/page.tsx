import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import { db, leadNotes, leads, listings as listingsTable } from "@realtor/db";
import { leadIntentLabel } from "@realtor/domain";
import { LeadNotesForm } from "@/components/lead-notes-form";
import { leadStatusClass } from "@/components/lead-status-pill";
import { getAgentForClerkUser } from "@/lib/agent";

const statusLabel: Record<string, string> = {
  new: "Nuevo",
  contacted: "Contactado",
  qualified: "Calificado",
  tour_scheduled: "Tour agendado",
  offer_intent: "Intencion de oferta",
  negotiating: "Negociando",
  won: "Ganado",
  lost: "Perdido",
};

function formatDate(d: Date | string) {
  return new Date(d).toLocaleString("es", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await auth.protect();
  const { userId } = await auth();
  if (!userId) notFound();
  const agentProfile = await getAgentForClerkUser(userId);
  if (!agentProfile) notFound();

  const { id } = await params;

  const [lead] = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
  if (!lead) notFound();

  const [linkedListing] = lead.listingId
    ? await db
        .select({ slug: listingsTable.slug, title: listingsTable.title })
        .from(listingsTable)
        .where(eq(listingsTable.id, lead.listingId))
        .limit(1)
    : [null];

  const notes = await db
    .select()
    .from(leadNotes)
    .where(eq(leadNotes.leadId, lead.id))
    .orderBy(desc(leadNotes.createdAt));

  return (
    <main className="min-h-[calc(100svh-4rem)] bg-linen">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-black/55 transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
        >
          <ArrowLeft size={15} aria-hidden />
          Volver a leads
        </Link>

        <div className="mt-4 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <article className="rounded bg-white p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-black/10 pb-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Lead</p>
                <h1 className="mt-2 font-display text-3xl font-medium tracking-tight">{lead.name}</h1>
                <p className="mt-1 text-sm text-black/55">Recibido el {formatDate(lead.createdAt)}</p>
              </div>
              <span className={`inline-flex rounded px-3 py-1.5 text-xs font-semibold ${leadStatusClass(lead.status)}`}>
                {statusLabel[lead.status] ?? lead.status}
              </span>
            </div>

            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <Info icon={<Mail size={15} aria-hidden />} label="Email" value={lead.email} />
              {lead.phone ? <Info icon={<Phone size={15} aria-hidden />} label="Telefono" value={lead.phone} /> : null}
              <Info label="Intencion" value={leadIntentLabel(lead.intent)} />
              <Info label="Score" value={String(lead.score)} />
              {linkedListing ? (
                <div className="sm:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-black/55">Propiedad</p>
                  <Link
                    href={`/propiedades/${linkedListing.slug}`}
                    target="_blank"
                    className="mt-1 inline-block font-medium text-gold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
                  >
                    {linkedListing.title}
                  </Link>
                </div>
              ) : null}
            </dl>

            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-black/55">Mensaje</p>
              <p className="mt-2 whitespace-pre-wrap rounded bg-linen p-4 text-sm leading-6 text-black/75">{lead.message}</p>
            </div>
          </article>

          <aside className="grid gap-6">
            <section className="rounded bg-white p-6">
              <h2 className="font-display text-xl font-medium tracking-tight">Notas</h2>
              <p className="mt-1 text-xs text-black/55">Registra llamadas, recordatorios y proximos pasos.</p>
              <div className="mt-4">
                <LeadNotesForm leadId={lead.id} />
              </div>
            </section>

            <section className="rounded bg-white p-6">
              <h2 className="font-display text-xl font-medium tracking-tight">Historial</h2>
              {notes.length === 0 ? (
                <p className="mt-3 text-sm text-black/55">Aun no hay notas registradas.</p>
              ) : (
                <ol className="mt-4 grid gap-3">
                  {notes.map((note) => (
                    <li key={note.id} className="rounded border border-black/10 p-4">
                      <p className="text-xs text-black/55">
                        <span className="font-semibold text-black/75">{note.authorName}</span> · {formatDate(note.createdAt)}
                      </p>
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6">{note.body}</p>
                    </li>
                  ))}
                </ol>
              )}
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Info({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-black/55">{label}</p>
      <p className="mt-1 inline-flex items-center gap-2 font-medium">
        {icon}
        {value}
      </p>
    </div>
  );
}
