import Link from "next/link";
import { auth, currentUser } from "@clerk/nextjs/server";
import { Plus } from "lucide-react";
import { getListingsForAgent } from "@/lib/listings";
import { getAgentForClerkUser } from "@/lib/agent";
import { ListingsTable } from "@/components/listings-table";

export default async function ListingsDashboardPage() {
  await auth.protect();
  const user = await currentUser();
  if (!user) return null;

  const agentProfile = await getAgentForClerkUser(user.id);

  if (!agentProfile) {
    return (
      <main className="min-h-[calc(100svh-4rem)] bg-linen">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Listings</p>
          <h1 className="mt-3 font-display text-3xl font-medium tracking-tight">Cuenta no vinculada a un agente</h1>
          <p className="mt-4 text-black/65">
            Para crear y administrar propiedades, tu cuenta de Clerk debe estar vinculada a un agente en la base de datos.
            Contacta al administrador para asignarte un perfil de agente.
          </p>
        </div>
      </main>
    );
  }

  const items = await getListingsForAgent(agentProfile.agentId);

  return (
    <main className="min-h-[calc(100svh-4rem)] bg-linen">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2 border-b border-black/10 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Listings</p>
            <h1 className="mt-2 font-display text-3xl font-medium tracking-tight">Mis propiedades</h1>
            <p className="mt-2 text-sm text-black/55">{items.length} {items.length === 1 ? "propiedad" : "propiedades"} asignadas a tu cuenta.</p>
          </div>
          <Link
            href="/dashboard/listings/new"
            className="inline-flex items-center justify-center gap-2 rounded bg-ink px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
          >
            <Plus size={17} aria-hidden />
            Nueva propiedad
          </Link>
        </div>

        <div className="mt-8 overflow-hidden rounded bg-white">
          <ListingsTable initialListings={items} />
        </div>
      </div>
    </main>
  );
}
