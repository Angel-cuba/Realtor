import Link from "next/link";
import { redirect } from "next/navigation";
import { PropertyCard } from "@/components/property-card";
import { SearchPanel } from "@/components/search-panel";
import { filterListings, getListingsByType, LISTINGS_PAGE_SIZE } from "@/lib/listings";

export default async function RentPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const q = (params.q as string | undefined) ?? "";
  const budget = (params.budget as string | undefined) ?? "";
  const page = Math.max(1, Math.floor(Number(params.page) || 1));

  function pageHref(p: number) {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    if (budget) sp.set("budget", budget);
    sp.set("page", String(p));
    return `/rentar?${sp.toString()}`;
  }

  const { listings: raw, total } = await getListingsByType("rent", { page, pageSize: LISTINGS_PAGE_SIZE });
  const listings = filterListings(raw, params);
  const totalPages = Math.max(1, Math.ceil(total / LISTINGS_PAGE_SIZE));

  if (page > totalPages && total > 0) {
    redirect(pageHref(totalPages));
  }

  return (
    <main className="bg-linen">
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Rentar</p>
        <h1 className="mt-3 max-w-3xl text-5xl font-semibold leading-tight">
          Rentas verificadas para decidir rapido y agendar sin friccion.
        </h1>
        <div className="mt-8">
          <SearchPanel intent="rent" defaultQ={q} defaultBudget={budget} />
        </div>
      </section>
      <section className="bg-white py-12">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
          {listings.length > 0 ? (
            listings.map((listing) => <PropertyCard listing={listing} key={listing.slug} />)
          ) : (
            <p className="col-span-3 py-16 text-center text-black/45">
              No hay propiedades que coincidan con tu busqueda.
            </p>
          )}
        </div>
        {totalPages > 1 && (
          <div className="mx-auto flex max-w-7xl items-center justify-between border-t border-black/10 px-4 pt-8 text-sm sm:px-6 lg:px-8">
            {page > 1 ? (
              <Link href={pageHref(page - 1)} className="font-medium text-gold hover:underline">
                ← Anterior
              </Link>
            ) : (
              <span className="text-black/25">← Anterior</span>
            )}
            <span className="text-black/45">
              Página {page} de {totalPages}
            </span>
            {page < totalPages ? (
              <Link href={pageHref(page + 1)} className="font-medium text-gold hover:underline">
                Siguiente →
              </Link>
            ) : (
              <span className="text-black/25">Siguiente →</span>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
