import { PropertyCard } from "@/components/property-card";
import { SearchPanel } from "@/components/search-panel";
import { getListingsByType } from "@/lib/listings";

export default function RentPage() {
  const listings = getListingsByType("rent");

  return (
    <main className="bg-linen">
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Rentar</p>
        <h1 className="mt-3 max-w-3xl text-5xl font-semibold leading-tight">Rentas verificadas para decidir rapido y agendar sin friccion.</h1>
        <div className="mt-8">
          <SearchPanel />
        </div>
      </section>
      <section className="bg-white py-12">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
          {listings.map((listing) => (
            <PropertyCard listing={listing} key={listing.slug} />
          ))}
        </div>
      </section>
    </main>
  );
}
