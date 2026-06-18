import { PropertyCard } from "@/components/property-card";
import { SearchPanel } from "@/components/search-panel";
import { filterListings, getListingsByType } from "@/lib/listings";

export default async function BuyPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const listings = filterListings(getListingsByType("sale"), params);
  const q = (params.q as string | undefined) ?? "";
  const budget = (params.budget as string | undefined) ?? "";

  return (
    <main className="bg-linen">
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Comprar</p>
        <h1 className="mt-3 max-w-3xl text-5xl font-semibold leading-tight">
          Propiedades en venta con informacion clara desde el primer click.
        </h1>
        <div className="mt-8">
          <SearchPanel intent="buy" defaultQ={q} defaultBudget={budget} />
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
      </section>
    </main>
  );
}
